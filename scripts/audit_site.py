#!/usr/bin/env python3
"""Read-only integrity audit for the BROS Wisata static website.

The script intentionally uses only the Python standard library.  It validates
the production HTML below ``id/``, ``ms/`` and ``en/`` and exits with status 1
when it finds an error that can break navigation, indexing, structured data,
or a basic form flow.  Warnings are informational and do not fail the run.

Usage (from the repository root):

    python scripts/audit_site.py
    python scripts/audit_site.py --max-issues 0   # show every issue
"""

from __future__ import annotations

import argparse
import json
import posixpath
import re
import sys
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict
from dataclasses import dataclass, field
from html.parser import HTMLParser
from pathlib import Path, PurePosixPath
from typing import Iterable
from urllib.parse import unquote, urlsplit, urlunsplit


LANGUAGES = ("en", "id", "ms")
REQUIRED_HREFLANGS = frozenset(("x-default", *LANGUAGES))
SITE_SCHEME = "https"
SITE_HOST = "broswisata.id"
INTERNAL_HOSTS = frozenset((SITE_HOST, f"www.{SITE_HOST}"))
IGNORED_SCHEMES = frozenset(
    ("data", "mailto", "tel", "sms", "javascript", "geo", "wa", "whatsapp")
)
VOID_ELEMENTS = frozenset(
    (
        "area",
        "base",
        "br",
        "col",
        "embed",
        "hr",
        "img",
        "input",
        "link",
        "meta",
        "param",
        "source",
        "track",
        "wbr",
    )
)

# These pages deliberately use localized, search-oriented filenames.  All
# unlisted filenames are expected to have the same stem in every language.
LOCALIZED_PAGE_KEYS = {
    ("en", "destination-bukit-lawang-tangkahan"): "destination-bukit-lawang-tangkahan",
    ("id", "destinasi-bukit-lawang-tangkahan"): "destination-bukit-lawang-tangkahan",
    ("ms", "destinasi-bukit-lawang-tangkahan"): "destination-bukit-lawang-tangkahan",
    ("en", "bukit-lawang-orangutan-trekking"): "bukit-lawang-orangutan",
    ("id", "wisata-bukit-lawang-orangutan"): "bukit-lawang-orangutan",
    ("ms", "bukit-lawang-orangutan-trekking"): "bukit-lawang-orangutan",
    ("en", "lake-toba-samosir-private-tour"): "lake-toba-samosir-private-tour",
    ("id", "private-tour-lake-toba-samosir"): "lake-toba-samosir-private-tour",
    ("ms", "pakej-lake-toba-samosir"): "lake-toba-samosir-private-tour",
    ("en", "private-north-sumatra-tour"): "private-north-sumatra-tour",
    ("id", "private-tour-sumatra-utara"): "private-north-sumatra-tour",
    ("ms", "pakej-private-tour-sumatera-utara"): "private-north-sumatra-tour",
    ("en", "singapore-to-north-sumatra-tour"): "singapore-to-north-sumatra-tour",
    ("id", "tour-sumatra-utara-dari-singapore"): "singapore-to-north-sumatra-tour",
    ("ms", "pakej-sumatera-utara-dari-singapore"): "singapore-to-north-sumatra-tour",
}

ACTION_WORDS = re.compile(
    r"\b(?:back|continue|next|send|submit|request|kembali|lanjut|kirim|"
    r"teruskan|hantar|permintaan|langkah|step)\b",
    re.IGNORECASE,
)


@dataclass(frozen=True)
class Issue:
    severity: str
    code: str
    page: str
    line: int
    message: str


@dataclass
class Reference:
    tag: str
    attribute: str
    value: str
    line: int
    attrs: dict[str, str]


@dataclass
class JsonBlock:
    line: int
    text: str


@dataclass
class Control:
    tag: str
    attrs: dict[str, str]
    line: int
    form_index: int | None


@dataclass
class Button:
    attrs: dict[str, str]
    line: int
    form_index: int | None
    text_parts: list[str] = field(default_factory=list)

    @property
    def text(self) -> str:
        return " ".join(" ".join(self.text_parts).split())


@dataclass
class Form:
    attrs: dict[str, str]
    line: int
    controls: list[int] = field(default_factory=list)
    buttons: list[int] = field(default_factory=list)


@dataclass
class Page:
    path: Path
    relative: str
    expected_language: str
    html_languages: list[tuple[int, str]] = field(default_factory=list)
    references: list[Reference] = field(default_factory=list)
    ids: dict[str, list[int]] = field(default_factory=lambda: defaultdict(list))
    anchors: set[str] = field(default_factory=set)
    canonicals: list[tuple[int, str]] = field(default_factory=list)
    alternates: dict[str, list[tuple[int, str]]] = field(
        default_factory=lambda: defaultdict(list)
    )
    robots: list[tuple[int, str]] = field(default_factory=list)
    json_blocks: list[JsonBlock] = field(default_factory=list)
    forms: list[Form] = field(default_factory=list)
    controls: list[Control] = field(default_factory=list)
    buttons: list[Button] = field(default_factory=list)
    parser_problems: list[tuple[int, str]] = field(default_factory=list)
    script_text: list[str] = field(default_factory=list)
    canonical_url: str | None = None
    alternate_urls: dict[str, str] = field(default_factory=dict)

    @property
    def is_noindex(self) -> bool:
        return any(
            re.search(r"(?:^|[\s,])noindex(?:$|[\s,])", content, re.IGNORECASE)
            for _, content in self.robots
        )


class ProductionHTMLParser(HTMLParser):
    """Collect only the HTML facts needed by the audit."""

    def __init__(self, page: Page) -> None:
        super().__init__(convert_charrefs=True)
        self.page = page
        self.form_stack: list[int] = []
        self.button_stack: list[int] = []
        self.active_json: tuple[int, list[str]] | None = None
        self.active_script: list[str] | None = None

    @staticmethod
    def _attrs(attrs: list[tuple[str, str | None]]) -> dict[str, str]:
        return {key.lower(): value or "" for key, value in attrs}

    def handle_starttag(
        self, tag: str, attrs: list[tuple[str, str | None]]
    ) -> None:
        tag = tag.lower()
        values = self._attrs(attrs)
        line = self.getpos()[0]

        element_id = values.get("id")
        if element_id:
            self.page.ids[element_id].append(line)
            self.page.anchors.add(element_id)
        if tag == "a" and values.get("name"):
            self.page.anchors.add(values["name"])

        if tag == "html":
            self.page.html_languages.append((line, values.get("lang", "")))

        for attribute in ("href", "src"):
            if attribute in values:
                self.page.references.append(
                    Reference(tag, attribute, values[attribute], line, dict(values))
                )

        if tag == "link":
            rels = {item.lower() for item in values.get("rel", "").split()}
            href = values.get("href", "")
            if "canonical" in rels:
                self.page.canonicals.append((line, href))
            if "alternate" in rels and values.get("hreflang"):
                language = values["hreflang"].strip().lower()
                self.page.alternates[language].append((line, href))

        if tag == "meta" and values.get("name", "").lower() == "robots":
            self.page.robots.append((line, values.get("content", "")))

        if tag == "script":
            self.active_script = []
            if values.get("type", "").strip().lower() == "application/ld+json":
                self.active_json = (line, [])

        if tag == "form":
            if self.form_stack:
                self.page.parser_problems.append((line, "nested <form> element"))
            self.page.forms.append(Form(values, line))
            self.form_stack.append(len(self.page.forms) - 1)

        form_index = self.form_stack[-1] if self.form_stack else None
        if tag in ("input", "select", "textarea"):
            self.page.controls.append(Control(tag, values, line, form_index))
            control_index = len(self.page.controls) - 1
            if form_index is not None:
                self.page.forms[form_index].controls.append(control_index)

        if tag == "button":
            self.page.buttons.append(Button(values, line, form_index))
            button_index = len(self.page.buttons) - 1
            self.button_stack.append(button_index)
            if form_index is not None:
                self.page.forms[form_index].buttons.append(button_index)

    def handle_startendtag(
        self, tag: str, attrs: list[tuple[str, str | None]]
    ) -> None:
        self.handle_starttag(tag, attrs)
        if tag.lower() not in VOID_ELEMENTS:
            self.handle_endtag(tag)

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()
        line = self.getpos()[0]
        if tag == "form":
            if self.form_stack:
                self.form_stack.pop()
            else:
                self.page.parser_problems.append((line, "unmatched </form> element"))
        elif tag == "button" and self.button_stack:
            self.button_stack.pop()
        elif tag == "script":
            if self.active_json is not None:
                start_line, chunks = self.active_json
                self.page.json_blocks.append(JsonBlock(start_line, "".join(chunks)))
                self.active_json = None
            if self.active_script is not None:
                self.page.script_text.append("".join(self.active_script))
                self.active_script = None

    def handle_data(self, data: str) -> None:
        if self.button_stack:
            self.page.buttons[self.button_stack[-1]].text_parts.append(data)
        if self.active_json is not None:
            self.active_json[1].append(data)
        if self.active_script is not None:
            self.active_script.append(data)

    def finish(self) -> None:
        if self.form_stack:
            for form_index in self.form_stack:
                self.page.parser_problems.append(
                    (self.page.forms[form_index].line, "unclosed <form> element")
                )
        if self.active_json is not None:
            self.page.parser_problems.append(
                (self.active_json[0], "unclosed JSON-LD <script> element")
            )


class SiteAudit:
    def __init__(self, root: Path) -> None:
        self.root = root.resolve()
        self.issues: list[Issue] = []
        self.pages: list[Page] = []
        self.pages_by_path: dict[Path, Page] = {}
        self.redirects = self._load_redirects()
        self.stats: Counter[str] = Counter()
        self.svg_ids_by_path: dict[Path, set[str] | None] = {}

    def add_issue(
        self,
        severity: str,
        code: str,
        page: str | Path,
        line: int,
        message: str,
    ) -> None:
        if isinstance(page, Path):
            try:
                page_text = page.resolve().relative_to(self.root).as_posix()
            except ValueError:
                page_text = str(page)
        else:
            page_text = page
        self.issues.append(Issue(severity, code, page_text, line, message))

    def _load_redirects(self) -> dict[str, str]:
        redirects: dict[str, str] = {}
        path = self.root / "_redirects"
        if not path.is_file():
            return redirects
        for raw_line in path.read_text(encoding="utf-8", errors="replace").splitlines():
            line = raw_line.strip()
            if not line or line.startswith("#"):
                continue
            parts = line.split()
            if len(parts) < 2:
                continue
            source, destination = parts[:2]
            if (
                source.startswith("/")
                and "*" not in source
                and ":" not in source
                and source not in redirects
            ):
                redirects[source] = destination
        return redirects

    def discover_and_parse_pages(self) -> None:
        html_paths: list[Path] = []
        for language in LANGUAGES:
            html_paths.extend(sorted((self.root / language).rglob("*.html")))

        for path in sorted(html_paths, key=lambda item: item.as_posix()):
            relative = path.relative_to(self.root).as_posix()
            language = relative.split("/", 1)[0]
            page = Page(path.resolve(), relative, language)
            parser = ProductionHTMLParser(page)
            try:
                parser.feed(path.read_text(encoding="utf-8", errors="strict"))
                parser.close()
                parser.finish()
            except (UnicodeDecodeError, OSError) as exc:
                self.add_issue("ERROR", "HTML_READ", relative, 0, str(exc))
                continue
            except Exception as exc:  # HTMLParser should be forgiving; report surprises.
                self.add_issue(
                    "ERROR", "HTML_PARSE", relative, parser.getpos()[0], str(exc)
                )
                continue
            self.pages.append(page)
            self.pages_by_path[page.path] = page

        self.stats["html_pages"] = len(self.pages)

    @staticmethod
    def _normalise_path(path: str) -> str:
        decoded = unquote(path or "/").replace("\\", "/")
        had_trailing_slash = decoded.endswith("/")
        normalised = posixpath.normpath("/" + decoded.lstrip("/"))
        if had_trailing_slash and normalised != "/":
            normalised += "/"
        return normalised

    def normalise_site_url(self, value: str) -> str | None:
        try:
            parts = urlsplit(value.strip())
            hostname = parts.hostname
        except ValueError:
            return None
        if parts.scheme.lower() != SITE_SCHEME or hostname not in INTERNAL_HOSTS:
            return None
        path = self._normalise_path(parts.path)
        return urlunsplit((SITE_SCHEME, SITE_HOST, path, "", ""))

    def route_to_file(self, route: str, seen: set[str] | None = None) -> Path | None:
        route = self._normalise_path(route)
        seen = seen or set()
        if route in seen or len(seen) > 8:
            return None
        seen.add(route)

        relative_route = route.lstrip("/")
        candidates: list[Path] = []
        if route.endswith("/"):
            candidates.append(self.root / relative_route / "index.html")
        else:
            exact = self.root / relative_route
            candidates.append(exact)
            if not Path(relative_route).suffix:
                candidates.append(self.root / f"{relative_route}.html")
                candidates.append(exact / "index.html")

        for candidate in candidates:
            try:
                resolved = candidate.resolve()
                resolved.relative_to(self.root)
            except (OSError, ValueError):
                continue
            if resolved.is_file():
                return resolved

        destination = self.redirects.get(route)
        if destination:
            parsed = urlsplit(destination)
            if not parsed.scheme and not parsed.netloc and parsed.path.startswith("/"):
                return self.route_to_file(parsed.path, seen)
        return None

    def resolve_reference(self, source: Page, value: str) -> tuple[Path | None, str] | None:
        raw_value = value.strip()
        if not raw_value:
            return (None, "")
        if raw_value.startswith(("{{", "{%", "<%")):
            return None

        parts = urlsplit(raw_value)
        scheme = parts.scheme.lower()
        if scheme in IGNORED_SCHEMES:
            return None
        if scheme and scheme not in ("http", "https"):
            return None
        if parts.netloc:
            if parts.hostname not in INTERNAL_HOSTS:
                return None
            route = parts.path or "/"
        else:
            if raw_value.startswith("//"):
                return None
            if parts.path.startswith("/"):
                route = parts.path
            elif not parts.path:
                return (source.path, unquote(parts.fragment))
            else:
                source_route = "/" + source.relative
                route = posixpath.join(posixpath.dirname(source_route), parts.path)

        return (self.route_to_file(route), unquote(parts.fragment))

    @staticmethod
    def expected_canonical_path(page: Page) -> str:
        relative = PurePosixPath(page.relative)
        within_language = PurePosixPath(*relative.parts[1:])
        stem = within_language.stem
        parent = within_language.parent
        if stem == "index":
            parent_path = "" if str(parent) == "." else f"{parent.as_posix()}/"
            return f"/{page.expected_language}/{parent_path}"
        if stem == "bros-wisata-homepage" and str(parent) == ".":
            return f"/{page.expected_language}/"
        return "/" + str(relative.with_suffix(""))

    def validate_page_metadata(self, page: Page) -> None:
        for line, problem in page.parser_problems:
            self.add_issue("ERROR", "HTML_STRUCTURE", page.relative, line, problem)

        if len(page.html_languages) != 1:
            self.add_issue(
                "ERROR",
                "HTML_LANG",
                page.relative,
                page.html_languages[0][0] if page.html_languages else 1,
                f"expected one <html lang>, found {len(page.html_languages)}",
            )
        elif page.html_languages[0][1].strip().lower() != page.expected_language:
            line, actual = page.html_languages[0]
            self.add_issue(
                "ERROR",
                "HTML_LANG",
                page.relative,
                line,
                f"lang={actual!r}; expected {page.expected_language!r}",
            )

        duplicate_ids = {
            element_id: lines for element_id, lines in page.ids.items() if len(lines) > 1
        }
        for element_id, lines in duplicate_ids.items():
            self.add_issue(
                "ERROR",
                "DUPLICATE_ID",
                page.relative,
                lines[1],
                f"id={element_id!r} appears on lines {', '.join(map(str, lines))}",
            )

        if len(page.canonicals) != 1:
            self.add_issue(
                "ERROR",
                "CANONICAL_COUNT",
                page.relative,
                page.canonicals[0][0] if page.canonicals else 1,
                f"expected one canonical link, found {len(page.canonicals)}",
            )
        else:
            line, href = page.canonicals[0]
            parts = urlsplit(href.strip())
            canonical = self.normalise_site_url(href)
            if canonical is None or parts.netloc.lower() != SITE_HOST:
                self.add_issue(
                    "ERROR",
                    "CANONICAL_URL",
                    page.relative,
                    line,
                    f"canonical must use https://{SITE_HOST}: {href!r}",
                )
            elif parts.query or parts.fragment:
                self.add_issue(
                    "ERROR",
                    "CANONICAL_URL",
                    page.relative,
                    line,
                    "canonical must not contain a query string or fragment",
                )
            else:
                expected_path = self.expected_canonical_path(page)
                actual_path = urlsplit(canonical).path
                if actual_path != expected_path:
                    self.add_issue(
                        "ERROR",
                        "CANONICAL_TARGET",
                        page.relative,
                        line,
                        f"canonical path {actual_path!r}; expected {expected_path!r}",
                    )
                else:
                    page.canonical_url = canonical

        present_hreflangs = set(page.alternates)
        missing = sorted(REQUIRED_HREFLANGS - present_hreflangs)
        if missing:
            self.add_issue(
                "ERROR",
                "HREFLANG_MISSING",
                page.relative,
                1,
                f"missing hreflang values: {', '.join(missing)}",
            )
        extras = sorted(present_hreflangs - REQUIRED_HREFLANGS)
        if extras:
            self.add_issue(
                "WARNING",
                "HREFLANG_EXTRA",
                page.relative,
                page.alternates[extras[0]][0][0],
                f"unexpected hreflang values: {', '.join(extras)}",
            )

        for language, entries in sorted(page.alternates.items()):
            if len(entries) != 1:
                self.add_issue(
                    "ERROR",
                    "HREFLANG_DUPLICATE",
                    page.relative,
                    entries[1][0] if len(entries) > 1 else entries[0][0],
                    f"hreflang={language!r} appears {len(entries)} times",
                )
                continue
            line, href = entries[0]
            normalised = self.normalise_site_url(href)
            parts = urlsplit(href.strip())
            if (
                normalised is None
                or parts.netloc.lower() != SITE_HOST
                or parts.query
                or parts.fragment
            ):
                self.add_issue(
                    "ERROR",
                    "HREFLANG_URL",
                    page.relative,
                    line,
                    f"hreflang={language!r} has invalid internal URL {href!r}",
                )
                continue
            target = self.route_to_file(urlsplit(normalised).path)
            if target is None:
                self.add_issue(
                    "ERROR",
                    "HREFLANG_TARGET",
                    page.relative,
                    line,
                    f"hreflang={language!r} target does not map to a file: {href}",
                )
                continue
            if language in LANGUAGES:
                try:
                    target_language = target.relative_to(self.root).parts[0]
                except ValueError:
                    target_language = ""
                if target_language != language:
                    self.add_issue(
                        "ERROR",
                        "HREFLANG_LANGUAGE",
                        page.relative,
                        line,
                        f"hreflang={language!r} points into /{target_language}/",
                    )
            page.alternate_urls[language] = normalised

        self_href = page.alternate_urls.get(page.expected_language)
        if page.canonical_url and self_href and self_href != page.canonical_url:
            line = page.alternates[page.expected_language][0][0]
            self.add_issue(
                "ERROR",
                "HREFLANG_SELF",
                page.relative,
                line,
                f"self hreflang {self_href} differs from canonical {page.canonical_url}",
            )

        for block in page.json_blocks:
            self.stats["json_ld_blocks"] += 1
            text = block.text.strip()
            if not text:
                self.add_issue(
                    "ERROR",
                    "JSON_LD_EMPTY",
                    page.relative,
                    block.line,
                    "empty application/ld+json block",
                )
                continue
            try:
                json.loads(text)
            except json.JSONDecodeError as exc:
                self.add_issue(
                    "ERROR",
                    "JSON_LD_PARSE",
                    page.relative,
                    block.line + exc.lineno - 1,
                    f"{exc.msg} (column {exc.colno})",
                )

    def validate_references(self, page: Page) -> None:
        for reference in page.references:
            self.stats["local_ref_candidates"] += 1
            value = reference.value.strip()
            if (
                reference.tag == "a"
                and reference.attribute == "href"
                and value in ("", "#")
            ):
                role = reference.attrs.get("role", "").strip().lower()
                anchor_id = reference.attrs.get("id", "").strip()
                scripts = "\n".join(page.script_text)
                id_is_bound = bool(
                    anchor_id and re.search(re.escape(anchor_id), scripts)
                )
                has_explicit_binding = bool(
                    reference.attrs.get("onclick", "").strip()
                    or any(
                        key.startswith("data-") and attr_value.strip()
                        for key, attr_value in reference.attrs.items()
                    )
                    or id_is_bound
                )
                if role == "button" and has_explicit_binding:
                    continue
                shown_value = "empty" if not value else repr(value)
                self.add_issue(
                    "ERROR",
                    "ANCHOR_HREF_PLACEHOLDER",
                    page.relative,
                    reference.line,
                    f"<a> has {shown_value} href; use a real URL or a bound <button>",
                )
                continue
            if not value:
                self.add_issue(
                    "ERROR",
                    "EMPTY_REFERENCE",
                    page.relative,
                    reference.line,
                    f"empty {reference.attribute} on <{reference.tag}>",
                )
                continue
            resolved = self.resolve_reference(page, value)
            if resolved is None:
                continue
            self.stats["local_refs_checked"] += 1
            target, fragment = resolved
            if target is None:
                self.add_issue(
                    "ERROR",
                    "LOCAL_TARGET_MISSING",
                    page.relative,
                    reference.line,
                    f"{reference.attribute} target not found: {value}",
                )
                continue
            if fragment:
                target_suffix = target.suffix.lower()
                if target_suffix == ".html":
                    target_page = self.pages_by_path.get(target.resolve())
                    if target_page is None:
                        self.add_issue(
                            "ERROR",
                            "FRAGMENT_TARGET_UNSCANNED",
                            page.relative,
                            reference.line,
                            f"cannot inspect fragment target: {value}",
                        )
                    elif fragment not in target_page.anchors:
                        self.add_issue(
                            "ERROR",
                            "FRAGMENT_MISSING",
                            page.relative,
                            reference.line,
                            f"fragment #{fragment} not found in {target_page.relative}",
                        )
                elif target_suffix == ".svg":
                    target_path = target.resolve()
                    if target_path not in self.svg_ids_by_path:
                        try:
                            svg_root = ET.parse(target_path).getroot()
                            self.svg_ids_by_path[target_path] = {
                                element_id
                                for element in svg_root.iter()
                                if (element_id := element.attrib.get("id"))
                            }
                        except (ET.ParseError, OSError) as exc:
                            self.svg_ids_by_path[target_path] = None
                            self.add_issue(
                                "ERROR",
                                "SVG_PARSE",
                                target_path,
                                0,
                                f"cannot validate SVG fragment IDs: {exc}",
                            )
                    svg_ids = self.svg_ids_by_path[target_path]
                    if svg_ids is not None and fragment not in svg_ids:
                        self.add_issue(
                            "ERROR",
                            "FRAGMENT_MISSING",
                            page.relative,
                            reference.line,
                            f"fragment #{fragment} not found in "
                            f"{target_path.relative_to(self.root).as_posix()}",
                        )
                else:
                    self.add_issue(
                        "WARNING",
                        "FRAGMENT_UNCHECKED",
                        page.relative,
                        reference.line,
                        f"cannot validate fragment #{fragment} in "
                        f"{target_suffix or 'extensionless'} "
                        f"target {value}",
                    )

    @staticmethod
    def _button_has_declared_action(button: Button) -> bool:
        attrs = button.attrs
        if any(key in attrs for key in ("id", "onclick", "form", "aria-controls")):
            return True
        if any(key.startswith("data-") for key in attrs):
            return True
        return attrs.get("type", "").lower() in ("submit", "reset")

    def validate_forms(self, page: Page) -> None:
        forms_by_id = {
            form.attrs["id"]: index
            for index, form in enumerate(page.forms)
            if form.attrs.get("id")
        }

        associated_controls: dict[int, list[int]] = defaultdict(list)
        orphan_controls: list[Control] = []
        for control_index, control in enumerate(page.controls):
            explicit_form = control.attrs.get("form")
            if explicit_form and explicit_form not in forms_by_id:
                self.add_issue(
                    "ERROR",
                    "FORM_OWNER_MISSING",
                    page.relative,
                    control.line,
                    f"<{control.tag}> references missing form id={explicit_form!r}",
                )
            owner = forms_by_id.get(explicit_form) if explicit_form else control.form_index
            if owner is None and not explicit_form:
                orphan_controls.append(control)
            elif owner is not None:
                associated_controls[owner].append(control_index)

        associated_buttons: dict[int, list[int]] = defaultdict(list)
        for button_index, button in enumerate(page.buttons):
            explicit_form = button.attrs.get("form")
            if explicit_form and explicit_form not in forms_by_id:
                self.add_issue(
                    "ERROR",
                    "FORM_OWNER_MISSING",
                    page.relative,
                    button.line,
                    f"<button> references missing form id={explicit_form!r}",
                )
            owner = forms_by_id.get(explicit_form) if explicit_form else button.form_index
            if owner is not None:
                associated_buttons[owner].append(button_index)

        orphan_action_buttons = [
            button
            for button in page.buttons
            if button.form_index is None
            and not self._button_has_declared_action(button)
            and ACTION_WORDS.search(button.text)
        ]
        if orphan_controls and orphan_action_buttons:
            sample_lines = ", ".join(
                str(button.line) for button in orphan_action_buttons[:5]
            )
            self.add_issue(
                "ERROR",
                "FORM_FLOW_UNBOUND",
                page.relative,
                orphan_action_buttons[0].line,
                f"{len(orphan_controls)} controls and {len(orphan_action_buttons)} action "
                f"buttons are outside any form/declared handler (button lines {sample_lines})",
            )
        elif orphan_controls:
            sample_lines = ", ".join(str(item.line) for item in orphan_controls[:5])
            self.add_issue(
                "WARNING",
                "FORM_CONTROLS_ORPHANED",
                page.relative,
                orphan_controls[0].line,
                f"{len(orphan_controls)} controls are outside a form (first lines {sample_lines})",
            )

        for button in page.buttons:
            button_type = button.attrs.get("type", "").lower()
            explicit_form = button.attrs.get("form")
            if button_type == "submit" and button.form_index is None and not explicit_form:
                self.add_issue(
                    "ERROR",
                    "SUBMIT_WITHOUT_FORM",
                    page.relative,
                    button.line,
                    "submit button has no owning form",
                )
            has_owner = button.form_index is not None or explicit_form in forms_by_id
            if has_owner and "type" not in button.attrs:
                self.add_issue(
                    "WARNING",
                    "BUTTON_TYPE_IMPLICIT",
                    page.relative,
                    button.line,
                    "button inside form has implicit type=submit; set type explicitly",
                )
            accessible_name = button.text or button.attrs.get("aria-label") or button.attrs.get(
                "title"
            )
            if not accessible_name:
                self.add_issue(
                    "WARNING",
                    "BUTTON_NAME_MISSING",
                    page.relative,
                    button.line,
                    "button has no text, aria-label, or title",
                )

        all_script_text = "\n".join(page.script_text)
        has_submit_listener = bool(
            re.search(r"addEventListener\s*\(\s*['\"]submit['\"]", all_script_text)
        )
        for form_index, form in enumerate(page.forms):
            action = form.attrs.get("action", "").strip()
            method = form.attrs.get("method", "get").strip().lower()
            if not action and not has_submit_listener:
                self.add_issue(
                    "WARNING",
                    "FORM_ACTION_MISSING",
                    page.relative,
                    form.line,
                    "form has no action and no visible submit event listener",
                )
            if method not in ("get", "post", "dialog"):
                self.add_issue(
                    "ERROR",
                    "FORM_METHOD_INVALID",
                    page.relative,
                    form.line,
                    f"unsupported form method {method!r}",
                )

            unnamed: list[Control] = []
            for control_index in associated_controls[form_index]:
                control = page.controls[control_index]
                control_type = control.attrs.get("type", "text").lower()
                is_successful = control_type not in (
                    "button",
                    "reset",
                    "submit",
                    "image",
                )
                if is_successful and not control.attrs.get("name"):
                    unnamed.append(control)
            if unnamed:
                sample_lines = ", ".join(str(item.line) for item in unnamed[:5])
                self.add_issue(
                    "ERROR",
                    "FORM_CONTROL_NAME_MISSING",
                    page.relative,
                    unnamed[0].line,
                    f"form on line {form.line} has {len(unnamed)} successful controls "
                    f"without name (first lines {sample_lines})",
                )

            has_submit = any(
                page.buttons[index].attrs.get("type", "submit").lower() == "submit"
                for index in associated_buttons[form_index]
            ) or any(
                page.controls[index].attrs.get("type", "").lower() in ("submit", "image")
                for index in associated_controls[form_index]
            )
            if associated_controls[form_index] and not has_submit and not has_submit_listener:
                self.add_issue(
                    "WARNING",
                    "FORM_SUBMIT_MISSING",
                    page.relative,
                    form.line,
                    "form has controls but no submit control or visible submit listener",
                )

    def validate_page_parity(self) -> None:
        grouped: dict[str, dict[str, list[str]]] = defaultdict(
            lambda: defaultdict(list)
        )
        for page in self.pages:
            relative = PurePosixPath(page.relative)
            within_language = PurePosixPath(*relative.parts[1:]).with_suffix("")
            stem = within_language.name
            if str(within_language.parent) == ".":
                key = LOCALIZED_PAGE_KEYS.get((page.expected_language, stem), stem)
            else:
                key = within_language.as_posix()
            grouped[key][page.expected_language].append(page.relative)

        for key, by_language in sorted(grouped.items()):
            missing = [language for language in LANGUAGES if not by_language.get(language)]
            duplicates = {
                language: paths
                for language, paths in by_language.items()
                if len(paths) > 1
            }
            if missing:
                present = ", ".join(
                    f"{language}={paths[0]}" for language, paths in sorted(by_language.items())
                )
                self.add_issue(
                    "ERROR",
                    "PAGE_PARITY",
                    "(language parity)",
                    0,
                    f"logical page {key!r} missing {', '.join(missing)}; present: {present}",
                )
            for language, paths in duplicates.items():
                self.add_issue(
                    "ERROR",
                    "PAGE_PARITY_DUPLICATE",
                    "(language parity)",
                    0,
                    f"logical page {key!r} has multiple {language} files: {', '.join(paths)}",
                )

    def validate_hreflang_reciprocity(self) -> None:
        for page in self.pages:
            if not page.canonical_url:
                continue
            for language in LANGUAGES:
                alternate_url = page.alternate_urls.get(language)
                if not alternate_url:
                    continue
                target_path = self.route_to_file(urlsplit(alternate_url).path)
                target_page = self.pages_by_path.get(target_path.resolve()) if target_path else None
                if target_page is None:
                    continue
                reciprocal = target_page.alternate_urls.get(page.expected_language)
                if reciprocal and reciprocal != page.canonical_url:
                    line = page.alternates[language][0][0]
                    self.add_issue(
                        "ERROR",
                        "HREFLANG_RECIPROCAL",
                        page.relative,
                        line,
                        f"{language} target {target_page.relative} links back to "
                        f"{reciprocal}, not {page.canonical_url}",
                    )

    def validate_sitemap(self) -> None:
        sitemap_path = self.root / "sitemap.xml"
        if not sitemap_path.is_file():
            self.add_issue("ERROR", "SITEMAP_MISSING", "sitemap.xml", 0, "file not found")
            return
        try:
            tree = ET.parse(sitemap_path)
        except (ET.ParseError, OSError) as exc:
            self.add_issue("ERROR", "SITEMAP_PARSE", "sitemap.xml", 0, str(exc))
            return

        root = tree.getroot()
        namespace = ""
        if root.tag.startswith("{"):
            namespace = root.tag.split("}", 1)[0] + "}"
        loc_values = [
            (element.text or "").strip()
            for element in root.findall(f"{namespace}url/{namespace}loc")
        ]
        self.stats["sitemap_urls"] = len(loc_values)
        duplicates = sorted(value for value, count in Counter(loc_values).items() if count > 1)
        for value in duplicates:
            self.add_issue(
                "ERROR", "SITEMAP_DUPLICATE", "sitemap.xml", 0, f"duplicate URL: {value}"
            )

        sitemap_urls: set[str] = set()
        for value in loc_values:
            parts = urlsplit(value)
            normalised = self.normalise_site_url(value)
            if (
                normalised is None
                or parts.netloc.lower() != SITE_HOST
                or parts.query
                or parts.fragment
            ):
                self.add_issue(
                    "ERROR",
                    "SITEMAP_URL",
                    "sitemap.xml",
                    0,
                    f"invalid canonical site URL: {value!r}",
                )
                continue
            sitemap_urls.add(normalised)
            target_path = self.route_to_file(urlsplit(normalised).path)
            if target_path is None:
                self.add_issue(
                    "ERROR",
                    "SITEMAP_TARGET_MISSING",
                    "sitemap.xml",
                    0,
                    f"URL does not map to a static file/clean route: {value}",
                )
                continue
            target_page = self.pages_by_path.get(target_path.resolve())
            if target_page is None:
                self.add_issue(
                    "ERROR",
                    "SITEMAP_TARGET_UNSCANNED",
                    "sitemap.xml",
                    0,
                    f"URL maps outside production language HTML: {value}",
                )
            elif target_page.canonical_url and target_page.canonical_url != normalised:
                self.add_issue(
                    "ERROR",
                    "SITEMAP_CANONICAL_MISMATCH",
                    "sitemap.xml",
                    0,
                    f"{value} maps to {target_page.relative}, whose canonical is "
                    f"{target_page.canonical_url}",
                )
            elif target_page.is_noindex:
                self.add_issue(
                    "ERROR",
                    "SITEMAP_NOINDEX",
                    "sitemap.xml",
                    0,
                    f"noindex page is listed: {value}",
                )

        expected_urls = {
            page.canonical_url
            for page in self.pages
            if page.canonical_url and not page.is_noindex
        }
        for missing in sorted(expected_urls - sitemap_urls):
            self.add_issue(
                "ERROR",
                "SITEMAP_CANONICAL_MISSING",
                "sitemap.xml",
                0,
                f"indexable canonical is absent: {missing}",
            )
        for extra in sorted(sitemap_urls - expected_urls):
            self.add_issue(
                "ERROR",
                "SITEMAP_NONCANONICAL",
                "sitemap.xml",
                0,
                f"URL is not an indexable production canonical: {extra}",
            )

    def run(self) -> list[Issue]:
        self.discover_and_parse_pages()
        for page in self.pages:
            self.validate_page_metadata(page)
        for page in self.pages:
            self.validate_references(page)
            self.validate_forms(page)
        self.validate_page_parity()
        self.validate_hreflang_reciprocity()
        self.validate_sitemap()
        return self.issues


def print_report(audit: SiteAudit, max_issues: int) -> None:
    severity_order = {"ERROR": 0, "WARNING": 1}
    issues = sorted(
        audit.issues,
        key=lambda item: (
            severity_order.get(item.severity, 9),
            item.page,
            item.line,
            item.code,
        ),
    )
    counts = Counter(issue.severity for issue in issues)
    code_counts = Counter(issue.code for issue in issues)

    print("BROS Wisata static-site audit")
    print(f"Root: {audit.root}")
    print(
        "Scanned: "
        f"{audit.stats['html_pages']} HTML | "
        f"{audit.stats['local_refs_checked']} local refs | "
        f"{audit.stats['json_ld_blocks']} JSON-LD blocks | "
        f"{audit.stats['sitemap_urls']} sitemap URLs"
    )

    if issues:
        print("\nIssues:")
        visible = issues if max_issues == 0 else issues[:max_issues]
        for issue in visible:
            location = issue.page + (f":{issue.line}" if issue.line else "")
            print(
                f"[{issue.severity}] {issue.code} {location} - {issue.message}"
            )
        hidden = len(issues) - len(visible)
        if hidden:
            print(f"... {hidden} more issue(s); rerun with --max-issues 0 to show all")
    else:
        print("\nNo issues found.")

    print(
        f"\nSummary: {counts['ERROR']} error(s), {counts['WARNING']} warning(s)"
    )
    if code_counts:
        print(
            "By code: "
            + ", ".join(
                f"{code}={count}" for code, count in sorted(code_counts.items())
            )
        )
    print("Result: " + ("FAIL" if counts["ERROR"] else "PASS"))


def parse_args(argv: Iterable[str] | None = None) -> argparse.Namespace:
    default_root = Path(__file__).resolve().parent.parent
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument(
        "--root",
        type=Path,
        default=default_root,
        help=f"repository root (default: {default_root})",
    )
    parser.add_argument(
        "--max-issues",
        type=int,
        default=60,
        help="maximum issue detail lines; 0 means unlimited (default: 60)",
    )
    args = parser.parse_args(argv)
    if args.max_issues < 0:
        parser.error("--max-issues must be zero or greater")
    return args


def main(argv: Iterable[str] | None = None) -> int:
    args = parse_args(argv)
    root = args.root.resolve()
    if not all((root / language).is_dir() for language in LANGUAGES):
        print(
            f"error: {root} does not contain all production language directories: "
            + ", ".join(LANGUAGES),
            file=sys.stderr,
        )
        return 2
    audit = SiteAudit(root)
    audit.run()
    print_report(audit, args.max_issues)
    return 1 if any(issue.severity == "ERROR" for issue in audit.issues) else 0


if __name__ == "__main__":
    raise SystemExit(main())
