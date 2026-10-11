# Architecture rules
- Keep landing-page product and feature previews in dedicated presentation components with section-scoped semantic CSS tokens, so marketing styles do not alter authenticated screens.
- Load section-specific external fonts through a document stylesheet link, not CSS remote imports, to preserve compiler compatibility.
