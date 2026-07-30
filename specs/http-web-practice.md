# HTTP and Web Protocol Practice — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, HTTP semantic-model, cache/cookie/CORS simulators, answer-parser, renderer, validation, and UI implementers

Normative language: **must**, **must not**, **should**, and **may** have their usual requirements meanings.

## 1. Topic overview

### Topic name

HTTP and Web Protocol Practice

### Topic goal

Develop fast, exact reasoning about what a user agent, origin server, cache, proxy, or CDN will do during a bounded web exchange.

The learner should become able to parse URLs and HTTP messages, choose methods and statuses that express the intended semantics, evaluate representation and header metadata, execute redirect/cache/cookie/CORS rules, and diagnose the first inconsistency in a synthetic exchange. The target is a reliable web-protocol mental model, not browser-devtools trivia or memorization of every registered field.

### Scope

The initial model ID is `http-web-v1`. It includes:

- absolute HTTP(S) URL structure, relative-reference resolution, effective ports, request targets, fragments, and UTF-8 percent encoding;
- HTTP methods, safety, idempotency, retry implications, and scenario-based method selection;
- request and response start lines, fields, representation metadata, and body-presence semantics;
- status-class interpretation and selection among a bounded, useful status set;
- field roles, field-value parsing in controlled grammars, and media-type negotiation with `Accept`;
- redirects, relative `Location` resolution, method rewriting or preservation, loops, and bounded chains;
- private and shared caching, freshness, `Cache-Control`, `Age`, `Expires`, validators, conditional requests, and `304` reuse;
- cookie storage, replacement, expiry, `Domain`, `Path`, `Secure`, `HttpOnly`, bounded `SameSite`, request selection, and opaque session identifiers;
- origins, same-origin comparisons, site keys supplied by fixtures, and controlled CORS/preflight decisions;
- MIME/media types, `Content-Type`, charset metadata, and representation-versus-resource distinctions;
- bounded browser/origin/proxy/CDN cache traces with explicit keys and policies;
- evidence-bounded diagnosis of generated browser/server exchanges.

Expected prior knowledge is limited to ordinary client/server vocabulary, tables, simple Boolean conditions, integer arithmetic in seconds, and the broad purpose of URLs. Every category supplies its own protocol prerequisites; neither Admin Practice nor Networking and Protocols is a launch prerequisite.

### Relationship to Admin Practice

This is an independent app.

Admin Practice owns concise operational questions about:

- extracting the endpoint and request target from a URL;
- following small DNS chains and route tables;
- matching listening sockets;
- applying a declared server route table to get a status;
- locating the first failed operational layer from DNS through HTTP.

This app may review endpoint parsing locally, but it goes deeper into URL encoding and reference resolution, HTTP semantics, fields, negotiation, redirects, caches, cookies, origins, CORS, intermediaries, and browser-visible outcomes. It does not ask the learner to choose shell commands, inspect real services, resolve DNS, select IP routes, or reason about listening sockets.

Shared URL conventions must agree where profiles overlap. A saved question records its owning topic and model version; apparent overlap is not permission to silently import Admin Practice prerequisites.

### Relationship to Networking and Protocols

Networking and Protocols owns:

- HTTP/1.1 byte-stream parsing and message framing;
- TCP connection identity, segmentation, acknowledgement, and retransmission;
- HTTP/1.1 connection reuse and conceptual HTTP/2 multiplexing;
- TLS handshake/SNI/ALPN/certificate reasoning and QUIC/HTTP/3 architecture;
- DNS transport, packets, captures, NAT/firewall behavior, and lower-layer diagnosis.

This app treats a syntactically valid HTTP request or response as an application-level semantic object. Request/response anatomy here identifies fields and meaning; it does not find message boundaries in arbitrary TCP bytes. HTTP version differences appear only when a displayed semantic rule requires them. The app does not parse HPACK/QPACK, frames, TLS records, packets, or congestion behavior.

An integrated question may state that DNS, transport, and TLS succeeded, but it must not require the learner to derive those facts. A failed CORS check is a browser exposure decision, not a TCP, TLS, firewall, or server-reachability failure.

### Exclusions

The initial app excludes:

- real network requests, loopback requests, DNS resolution, sockets, WebSockets, WebTransport, WebRTC, service workers, browser automation, and packet capture;
- a backend, local server, remote API, public-suffix lookup, certificate store, browser history, password store, or access to actual cookies/cache/storage;
- unrestricted parsing of learner-supplied URLs, headers, HTML, JavaScript, HAR files, or captures;
- HTTP/1 byte framing ambiguities, request smuggling, response splitting, header-injection payloads, cache poisoning, CORS exploitation, CSRF exploitation, credential theft, tracking techniques, or bypass instructions;
- TLS and cryptographic mechanics, DNS, TCP/UDP, IP routing, ports beyond URL effective-port calculation, HTTP/2 frames, HTTP/3, and QUIC;
- HTML parsing/rendering, DOM behavior, JavaScript execution semantics, CSP, SRI, permissions policy, authentication-protocol internals, OAuth/OIDC, and WebAuthn;
- form submission encoding and `application/x-www-form-urlencoded` `+`-for-space behavior except as an explicit contrast note;
- unrestricted internationalized hostnames, IDNA, Unicode normalization, IPv6 URL literals in core generation, userinfo, data/blob/file URLs, opaque origins, and non-HTTP schemes;
- multipart boundary parsing, byte ranges, content codings, trailer fields, structured fields, signatures, and complete field registries;
- heuristic freshness, `stale-while-revalidate`, `stale-if-error`, request collapsing, cache invalidation by unsafe methods beyond declared traces, and vendor-specific CDN behavior;
- a complete cookie/public-suffix implementation, partitioned cookies, cookie prefixes, eviction quotas, storage partitioning, bounce mitigation, or browser-version comparisons;
- open-ended web debugging with multiple equally plausible causes or free-form prose as the primary graded response;
- live security-sensitive experiments or instructions to weaken browser security.

Material in those areas requires a separately named model extension.

### Offline and safety contract

The delivered app is one standalone HTML file with embedded JavaScript and CSS. At runtime it:

- makes no network request and contains no remote asset, analytics, font, telemetry, or update check;
- registers no service worker and opens no socket, peer connection, worker with remote code, popup, or hidden browsing context;
- reads no browser cookies, cache, history, storage, clipboard, credentials, certificate state, interface information, or environment data;
- requests no permissions and executes no learner-authored code;
- stores progress locally only when the learner opts in, using versioned non-sensitive records;
- uses only generated `.test` names, synthetic identities, synthetic headers, and fixture times.

All requests, responses, cookie jars, caches, timelines, policy tables, browser decisions, and server observations are immutable synthetic question data. “Send,” “receive,” “store,” and “navigate” always mean transition the local simulator.

### Pinned semantic profile

#### URL and percent-encoding profile

- Core absolute URLs have grammar `http[s]://host[:port][/path][?query][#fragment]`.
- Hosts are ASCII DNS names under `.test`, compared case-insensitively and displayed lowercase. Trailing-dot, userinfo, empty host, nondecimal port, and out-of-range port forms are excluded.
- Default ports are 80 for `http` and 443 for `https`. An explicitly written default port and an omitted default port denote the same origin.
- An absent path serializes as `/` for the HTTP request target. The request target is path plus optional `?query`; a fragment is client-side and is never sent in an HTTP request target.
- URL parsing happens before percent-decoding. A percent-encoded `/`, `?`, or `#` remains data in its component and never becomes a structural delimiter during the same exercise.
- Percent triplets use `%` plus two hexadecimal digits. Input hex is case-insensitive; feedback uses uppercase.
- Text-to-byte encoding uses UTF-8. A family supplies an explicit component-safe set; bytes outside it are emitted as `%HH`. Space becomes `%20`, never `+`.
- Decode-to-text questions first decode valid triplets to bytes and then require valid shortest-form UTF-8. Invalid triplets and invalid UTF-8 are generated only in recognition variants whose answer is a controlled error label.
- Relative `Location` resolution uses the displayed base URL and the `http-web-v1` RFC-3986-style hierarchy subset: scheme-relative, absolute-path, relative-path, query-only, and fragment-only references; dot segments are removed after path merge. Empty-authority and abnormal backslash cases are excluded.

#### HTTP semantic profile

- Core methods are `GET`, `HEAD`, `POST`, `PUT`, `DELETE`, `PATCH`, and `OPTIONS`.
- `GET`, `HEAD`, and `OPTIONS` are safe in the teaching model. Safe means the client does not request a state change; it does not promise that logging, billing counters, or other incidental effects are impossible.
- `GET`, `HEAD`, `PUT`, `DELETE`, and `OPTIONS` are idempotent by standardized intent. `POST` and `PATCH` are not assumed idempotent. A scenario may supply a stronger application contract, but it must be printed.
- Idempotent means multiple identical intended requests have the same intended effect as one; it does not promise identical response bytes/statuses or that arbitrary retries are always wise.
- `HEAD` has the semantics of `GET` without a response message body. Responses to `1xx`, `204`, and `304` also have no message body in generated semantic questions.
- Field names compare case-insensitively and normalize to lowercase internally. Display preserves a conventional spelling. Generated values use explicit restricted parsers; obsolete folding and ambiguous duplicate-field cases are excluded.
- `Content-Type` describes the media type of the enclosed representation. It does not describe the resource “forever.” `Content-Length` and transfer framing are not used here to locate bodies in byte streams.

The selectable status set is:

| Status | Teaching meaning |
|---|---|
| `200 OK` | successful response with ordinary selected representation/result |
| `201 Created` | request created a resource; generated cases include its `Location` |
| `202 Accepted` | accepted for later processing, not completed |
| `204 No Content` | successful response with no message body |
| `301 Moved Permanently`, `308 Permanent Redirect` | persistent redirection |
| `302 Found`, `303 See Other`, `307 Temporary Redirect` | temporary/indirect redirection under the redirect profile below |
| `304 Not Modified` | conditional retrieval may reuse a stored representation |
| `400 Bad Request` | malformed request under displayed application grammar |
| `401 Unauthorized` | authentication credentials absent/invalid; generated response includes a challenge |
| `403 Forbidden` | server understood and refuses authorization |
| `404 Not Found` | no current target resource is exposed |
| `405 Method Not Allowed` | target exists but method is unsupported; generated response includes `Allow` |
| `406 Not Acceptable` | no available representation satisfies proactive negotiation |
| `409 Conflict` | request conflicts with current resource state |
| `410 Gone` | resource deliberately reported as no longer available |
| `412 Precondition Failed` | a request precondition evaluated false |
| `415 Unsupported Media Type` | request representation format is unsupported |
| `422 Unprocessable Content` | syntax/media type accepted but instructions are semantically invalid |
| `429 Too Many Requests` | displayed rate policy rejects the request |
| `500 Internal Server Error` | origin encountered an unexpected failure |
| `502 Bad Gateway` | intermediary received an invalid/failed upstream response |
| `503 Service Unavailable` | service temporarily cannot handle request |
| `504 Gateway Timeout` | intermediary timed out waiting for upstream |

Prompts give enough facts to distinguish nearby statuses. The app never treats a status reason phrase as normative input.

#### Redirect profile

- A `Location` value is resolved against the current response URL.
- `303` changes every method except `HEAD` to `GET` and drops the request body and its representation-specific fields.
- `307` and `308` preserve method and body.
- For this pinned user-agent profile, `301` and `302` change `POST` to `GET`; they preserve `GET` and `HEAD`. Other starting methods with `301`/`302` are rejected to avoid user-agent-dependent history.
- Redirects never forward a URL fragment in an HTTP request. Fragment inheritance/resolution is shown only in URL-state questions.
- On every hop, `Host`, cookies, and cache lookup are recomputed from the new URL. Generated cross-origin hops remove `Authorization`; no exercise asks whether a nonstandard sensitive field is forwarded.
- Chains contain at most five followed redirects and have an explicit follow limit. Loops and limit exhaustion produce distinct outcomes.

#### Media negotiation profile

- Core proactive negotiation uses `Accept` only. Available representations have media type, optional media parameters, language label for display only, and server preference index.
- A media range may be `type/subtype`, `type/*`, or `*/*`, with `q` from `0` through `1` in thousandths. `q=0` means unacceptable.
- For each representation, the most specific matching range supplies its quality: exact type/subtype outranks `type/*`, which outranks `*/*`; among equally specific ranges, more matching media parameters outrank fewer, then earlier field order.
- Select the representation with greatest resulting quality, then greatest matched specificity/parameter count, then lowest displayed server preference index. If none has quality above zero, answer `406`.
- Missing `Accept` is equivalent in this teaching profile to `*/*;q=1`.
- `Vary: Accept` is required in generated cacheable negotiated responses whose selection can differ by `Accept`.

#### Time and cache profile

- All times are integer seconds on a displayed monotonic exercise timeline. HTTP date strings, when shown, map to displayed integer instants; leap seconds and clock skew beyond the formula below are excluded.
- A cache entry is private-browser or shared-intermediary. The prompt names which.
- A response is not stored when `no-store` applies. `private` prohibits shared-cache storage but permits private storage. `no-cache` permits storage but requires successful validation before reuse. `must-revalidate` forbids stale reuse in this profile.
- A generated response is cacheable only when the fixture marks its method/status as cacheable under the profile or an explicit freshness directive permits it. Core storage traces use `GET` with `200`, `301`, or `404`; other statuses appear only with explicit fixture policy.
- Freshness lifetime is chosen in order: shared-cache `s-maxage`; otherwise `max-age`; otherwise valid `Expires - Date`, floored at zero; otherwise zero. Heuristic freshness is excluded.
- Current age is:

```text
apparent_age         = max(0, response_time - Date)
response_delay       = response_time - request_time
corrected_age_value  = Age + response_delay
corrected_initial_age= max(apparent_age, corrected_age_value)
resident_time        = now - response_time
current_age          = corrected_initial_age + resident_time
```

- An entry is fresh exactly when `current_age < freshness_lifetime`; equality is stale.
- Client request `no-cache` forces validation before reuse. Request `max-age=N` accepts only an entry whose current age is at most `N`, subject to response restrictions. Other request directives are excluded in v1.
- Validators are opaque. Strong ETags compare octet-for-octet and are not prefixed `W/`; weak ETags are prefixed `W/`. `If-Match` uses strong comparison. `If-None-Match` uses weak comparison. `Last-Modified` dates compare at displayed whole-second precision.
- `If-None-Match` takes precedence over `If-Modified-Since`; `If-Match` takes precedence over `If-Unmodified-Since`. Advanced generated requests contain only precedence combinations explicitly covered by an oracle table.
- A false `If-None-Match`/not-modified condition on `GET` or `HEAD` yields `304`; on another method it yields `412`. A false modification precondition yields `412`.
- In a generated `304` trace, the stored body remains. Metadata fields present in the `304` replace their stored counterparts; the generator limits these to `Date`, `Cache-Control`, `Expires`, `ETag`, `Last-Modified`, and `Vary`. The resulting entry's age/freshness is recomputed from the validation exchange.

#### Cookie and site profile

- Cookies are stored as `(name, value, domain, host_only, path, secure, http_only, same_site, expiry, creation_index)`.
- Names and values are opaque ASCII tokens in generated core questions. A cookie value is not decoded as a URL, identity, permission, or cryptographic proof.
- A `Set-Cookie` replaces an existing cookie with equal name, domain, and path while preserving that tuple's original creation index; a genuinely new tuple receives the next creation index. An already-expired update deletes that tuple.
- Without `Domain`, a cookie is host-only for the response host. With an accepted `Domain`, it domain-matches that host and subdomains by label boundary. Fixtures never use public suffixes or unrelated domains.
- Default path is `/` when the response path is empty, does not start with `/`, or has only its initial `/`; otherwise it is the path substring up to but excluding the rightmost `/`. Path-match is prefix-based with the cookie-path boundary rule; it is not filesystem access control.
- In this teaching profile, a `Secure` cookie is accepted only from an `https` response and is sent only on `https` fixture URLs. `HttpOnly` hides a cookie from the synthetic script-read operation but does not prevent HTTP request sending.
- `SameSite=Strict` is sent only for same-site requests. `Lax` is also sent for a cross-site top-level navigation using a safe method. `None` permits cross-site sending and is accepted only with `Secure`.
- The exercise supplies each origin's synthetic `site_key`; learners never compute a registrable domain or consult a public-suffix list.
- Matching cookies are ordered by descending path length, then ascending creation index. The request `Cookie` field contains only `name=value` pairs.
- Cookie inclusion also depends on the displayed credentials mode. CORS response exposure never retroactively determines whether a request reached the server.

#### Origin and CORS profile

- An origin is `(scheme, lowercase host, effective port)`. Path, query, and fragment are irrelevant. `http` and `https` are different origins.
- Only tuple origins are generated; opaque origins, sandboxed documents, `null`, redirects during preflight, and private-network access are excluded.
- CORS rules follow the pinned `fetch-cors-profile-2026-07-30` teaching subset. They control whether a synthetic script may read a cross-origin response; they do not prove the server was unreachable and are not an authentication system.
- A CORS-safelisted request uses `GET`, `HEAD`, or `POST`; only safelisted request fields; and, when `Content-Type` is set, one of `application/x-www-form-urlencoded`, `multipart/form-data`, or `text/plain` with generated safe parameters. The profile directly labels every request field as safelisted/non-safelisted in worked data.
- A non-safelisted cross-origin scripted request requires a preflight. Preflight checks the requested method and normalized non-safelisted field-name set against `Access-Control-Allow-Methods` and `Access-Control-Allow-Headers`.
- For a non-credentialed response, `Access-Control-Allow-Origin: *` or the exact serialized requesting origin permits origin access. For a credentialed response, the origin must match exactly and `Access-Control-Allow-Credentials: true` must be present; wildcard origin is not accepted.
- Same-origin scripted requests do not use CORS response gates. `mode: no-cors` opaque responses and exposed-response-header lists are excluded in v1.

### Synthetic namespace and data rules

- Hosts end in `.test`; common hosts are `app.test`, `api.test`, `cdn.test`, and subdomains thereof.
- Resource identifiers, usernames, and session values are invented and carry no relationship to the learner.
- Bodies are short UTF-8 strings or labeled byte sequences, normally at most 256 bytes.
- Header tables contain at most 12 rows; cookie jars and caches at most 8 entries; redirect chains at most 5 hops; exchange timelines at most 12 events.
- Dates are rendered in both HTTP-date form and exercise-relative seconds whenever date parsing would distract from the target skill.
- Generated examples never include secrets that resemble real credentials, bearer tokens, or production hostnames.

### Global answer conventions

- Surrounding whitespace is ignored.
- Methods and field names are checked case-insensitively and shown uppercase/conventional-case in feedback.
- Scheme and host comparisons are case-insensitive; path, query, fragment, cookie name/value/path, ETag opaque tag, and representation body are case-sensitive.
- Percent hex digits are case-insensitive. A percent-encoded answer otherwise compares byte-for-byte after normalizing hex case; gratuitously encoding safe bytes is accepted only when the family explicitly allows equivalent serializations.
- URLs are compared through the controlled parser and canonical component tuple, not raw spelling, except in a serialization exercise.
- Status answers accept the three-digit integer; a reason phrase is optional and ignored.
- Durations/ages require seconds when the input control does not display a fixed `s` suffix.
- Media types and parameter names compare case-insensitively; generated parameter values follow their declared sensitivity.
- ETags require quotes and preserve weakness and opaque-tag case exactly.
- Ordered sequences are order-sensitive. Sets of fields/cookies/representations are order-insensitive unless wire emission or precedence order is the skill.
- Multi-field answers are graded per field, though full correctness requires all required fields.
- Controlled labels such as `fresh`, `stale`, `store`, `do not store`, `send`, `omit`, `exposed`, and `blocked from script` are preferred over free prose.

### Difficulty philosophy

Difficulty should increase through weaker component cues, inversion, interacting directives, state transitions over time, method/status contrasts, one additional redirect/cache/cookie/policy table, or distinguishing server receipt from browser exposure.

Difficulty must not increase through long header dumps, obscure registered methods/statuses, giant cookie jars, tedious HTTP-date arithmetic, vendor quirks, deliberately misleading typography, arbitrary time pressure, or hidden browser defaults. At most one not-yet-mastered mechanism may be introduced in a combined trace.

### Shared family contract

Every family below inherits these requirements:

- **Skill and mental operation:** the task states the trainable operation and why repetition improves it.
- **Response and template:** response mode is separate from semantics; wording and brace placeholders are normative. “Generated data” defines every placeholder's type, range, display, and relationships.
- **Derivation and accepted answers:** derivation is deterministic under `http-web-v1`; accepted forms additionally inherit global answer conventions.
- **Constraints and rejection:** constraints include instance constraints and explicit low-value/ambiguous rejection rules.
- **Variations and difficulty:** variations preserve the mental operation. `L1`–`L4` introduce qualitatively different reasoning; a family may omit a level it cannot support honestly.
- **Misconceptions and distractors:** every choice distractor is a named wrong transform. If it equals the answer or another normalized choice, regenerate it.
- **Feedback:** correct feedback names the decisive rule. Incorrect feedback identifies the earliest divergent operation. The worked solution shows state before/after or a compact derivation, not just the answer.
- **Examples:** each family has at least three fully instantiated examples spanning straightforward, representative, and upper intended difficulty, with answer, derivation, level, and targeted misconception.
- **Implementation and validation:** prompt, answer, choices, diagrams, and solution are projections of one semantic instance. Validation uses an independent oracle/table or reversible invariant where practical, checks unique answers, and fuzzes seeds.
- **Coverage:** generation balances positive/negative outcomes, boundary cases, directions, representations, and misconception transforms while suppressing recent structural duplicates.

## 2. Category: URLs and HTTP message anatomy

### Category purpose

Train exact separation of URL components, encoded bytes, request metadata, response metadata, and representation bodies.

### Learn

A URL identifies and locates; an HTTP request target normally contains path and query but not fragment. Percent encoding operates on bytes inside a component: `%2F` can represent a slash byte without becoming a path separator during parsing.

An HTTP request has a method, target, fields, and optional content. A response has a status, fields, and optional content. Fields describe the message, selected representation, caching, or later processing; they are not all interchangeable.

### Prerequisites

ASCII punctuation, UTF-8 at the idea-of-bytes level, and client/server vocabulary.

### Category boundaries

Endpoint-only URL parsing also appears in Admin Practice. This category owns component-safe encoding and semantic message interpretation. HTTP/1.1 CRLF parsing, framing, TCP segmentation, and connection reuse belong to Networking and Protocols.

### Subcategories

1. URL components and request targets
2. Percent encoding
3. Request anatomy
4. Response anatomy

### Family `web_url_components`

**Skill and mental operation.** Parse a controlled absolute URL into scheme, host, written/effective port, path, query, fragment, origin, and request target. The learner marks delimiters before interpreting component contents.

**Response and template.** Multiple named fields. `Parse {url}. Give scheme, host, written port, effective port, path, query, fragment, origin, and HTTP request target.`

**Generated data.** `{url}` is a valid core-profile absolute URL. Optional port is 1–65535; path has 0–5 segments; query has 0–4 opaque pairs; fragment is optional. Percent triplets remain encoded.

**Derivation and accepted answers.** Apply the pinned grammar, lowercase scheme/host, supply the scheme default effective port, serialize absent path as `/`, form origin tuple, and exclude fragment from request target. Empty versus absent query/fragment is shown by separate fields and accepted only as labeled by the UI.

**Constraints and rejection.** Exactly one parse; no userinfo, malformed triplet, IPv6 literal, or delimiter ambiguity. Reject cosmetic cases in which all optional components are absent after the learner has mastered L1.

**Variations and difficulty.** L1 path only with default port; L2 explicit/default ports and query; L3 encoded delimiter plus fragment; L4 compare two serializations or fill a missing component from origin/target.

**Misconceptions and distractors.** `fragment_in_target`, `decode_before_parse`, `written_port_only`, `host_includes_port`, and `empty_path_not_slash`.

**Feedback.** Highlight delimiters and show `URL → origin + request target + client-only fragment`.

**Examples.**

1. `https://app.test/docs` → host `app.test`, effective port `443`, path `/docs`, target `/docs`, origin tuple `(https, app.test, 443)`. L1; targets default-port omission.
2. `http://api.test:8080/items?q=a#top` → target `/items?q=a`; fragment `top` is excluded. L2; targets fragment forwarding.
3. `https://app.test/a%2Fb?next=%2Fhome#x` → path `/a%2Fb`, query `next=%2Fhome`, target `/a%2Fb?next=%2Fhome`; encoded slashes do not restructure it. L3; targets decode-before-parse.

**Implementation and validation.** Use a restricted tokenizer rather than the runtime page URL object. Parse/serialize round trips must preserve the semantic tuple; compare shared cases with Admin Practice fixtures.

**Coverage.** Balance schemes, explicit/default/nondefault ports, empty/root/multisegment paths, query, fragment, and encoded delimiters.

### Family `percent_encoding_transform`

**Skill and mental operation.** Encode text for a named URL component or decode percent-encoded bytes without confusing URL encoding with form encoding or structural parsing.

**Response and template.** Short text or byte sequence. `{direction} {value} for a {component} whose safe set is {safe_set}, using UTF-8 percent encoding.`

**Generated data.** `{direction}` is encode, decode-to-bytes, or decode-to-text. `{value}` is 1–20 Unicode scalar values or 1–24 encoded bytes. `{component}` is path segment, query value, or fragment data. `{safe_set}` is printed as literal ASCII characters/ranges and always includes alphanumerics plus a small declared punctuation subset.

**Derivation and accepted answers.** Encode input to UTF-8 bytes; copy safe ASCII bytes and percent-encode every other byte using `%HH`. Decode only triplets, assemble bytes, then decode strict UTF-8 if text is requested. Hex case is ignored. Encoding additional safe bytes is rejected in canonical-serialization mode and accepted only in explicitly labeled semantic-equivalence mode.

**Constraints and rejection.** Core questions contain valid Unicode and triplets. Recognition variants contain exactly one of `bad_hex`, `truncated_triplet`, or `invalid_utf8`. Reject strings requiring more than six triplets or whose only challenge is repetitive copying.

**Variations and difficulty.** L1 ASCII space/reserved mark; L2 several bytes/component safe-set contrast; L3 non-ASCII UTF-8; L4 identify invalid encoding or contrast `%20` with literal `+`.

**Misconceptions and distractors.** `space_as_plus`, `encode_code_point_number`, `decode_reserved_as_structure`, `single_hex_digit`, `latin1_bytes`.

**Feedback.** Show code point → UTF-8 bytes → copied/encoded bytes. State that `+` is literal in this family.

**Examples.**

1. Encode `red blue` with alphanumerics safe → `red%20blue`. L1; targets `space_as_plus`.
2. Decode path-segment text `a%2Fb` → `a/b` as segment data, not two URL segments. L2; targets decode-before-parse.
3. Encode `café` with ASCII letters safe → `caf%C3%A9`. L3; targets Latin-1/single-code-point encoding.

**Implementation and validation.** Implement UTF-8 encode/decode over code points and a byte-level triplet parser. Differential-test valid UTF-8 against `TextEncoder`/fatal `TextDecoder` at build time, while keeping the semantic helper authoritative and local.

**Coverage.** Include space, `%`, `/`, `?`, `#`, safe punctuation, two-/three-/four-byte UTF-8, mixed literal/encoded bytes, and every invalid recognition label.

### Family `http_request_anatomy`

**Skill and mental operation.** Identify the semantic parts of a generated request and determine which metadata describes the target, client preferences, request representation, credentials mode, or conditions.

**Response and template.** Matching plus named fields. `Inspect the synthetic request {request_card}. Identify {requested_parts} and match each field to its role.`

**Generated data.** `{request_card}` is a structured method/target/field/body card, not arbitrary bytes. It contains 1–7 fields selected from `Host`, `Accept`, `Content-Type`, `If-None-Match`, `Cookie`, `Origin`, and controlled CORS fields. `{requested_parts}` names method, target, fields, content, or roles.

**Derivation and accepted answers.** Read the semantic object; do not infer absent body framing. `Content-Type` describes request content, `Accept` desired response media, conditions refer to selected representation state, and fragment never appears.

**Constraints and rejection.** Syntactically valid, one role per asked field in context, body at most 80 bytes. No duplicate ambiguity, message framing, malformed CRLF, or secrets. Reject pure label-recall sets without a concrete request purpose.

**Variations and difficulty.** L1 locate parts; L2 distinguish request-content and response-preference fields; L3 connect conditional/origin/cookie metadata; L4 find one semantic inconsistency.

**Misconceptions and distractors.** `accept_describes_request_body`, `content_type_describes_desired_response`, `host_is_path`, `cookie_is_response_only`, `fragment_sent`.

**Feedback.** Highlight each field on the card and connect it by an arrow to target, request content, desired response, state, or browser policy.

**Examples.**

1. `GET /items` with `Accept: application/json` → method GET; target `/items`; Accept states a response preference. L1.
2. `POST /items`, `Content-Type: application/json`, body `{}` → Content-Type describes the two-byte request representation. L2; targets Accept/Content-Type reversal.
3. `GET /doc` with `If-None-Match: "v2"` and no body → conditional retrieval using a validator, not an upload tagged `v2`. L3.

**Implementation and validation.** Render from a typed `HttpRequest` object. A schema role table and consistency predicates independently verify all matches.

**Coverage.** Balance bodyless/body-bearing methods, targets with queries, field roles, present/absent conditions, and valid/inconsistent recognition cases.

### Family `http_response_anatomy`

**Skill and mental operation.** Identify status, fields, selected representation metadata, and whether a semantic response has a message body.

**Response and template.** Multiple named fields. `Inspect the response to {request_method}: {response_card}. Give status class, body-permitted result, representation media type, and requested field roles.`

**Generated data.** `{request_method}` is core-profile. `{response_card}` contains status, 0–8 fields, and optional representation. Status/body combinations follow the pinned profile.

**Derivation and accepted answers.** Classify the status, apply HEAD/`1xx`/`204`/`304` body rules before looking at a displayed payload placeholder, and read `Content-Type` only when representation metadata is present.

**Constraints and rejection.** No byte-stream framing. A recognition variant may contain exactly one declared contradiction. Reject a “no body” item whose answer is obvious only because no body row is drawn; show a body candidate when testing the rule.

**Variations and difficulty.** L1 ordinary `200`; L2 `201`/`204`; L3 HEAD or `304`; L4 identify contradiction among status, field, and representation.

**Misconceptions and distractors.** `all_2xx_have_body`, `head_has_get_body`, `304_body_from_cache_is_message_body`, `location_is_content_type`, `status_phrase_controls`.

**Feedback.** Apply a body-permission decision row, then separate response message body from a stored representation later reused by a cache.

**Examples.**

1. GET response `200`, `Content-Type: text/plain`, content `OK` → 2xx, body permitted, media `text/plain`. L1.
2. POST response `204` with no representation → success, no message body. L2; targets “success always has body.”
3. GET conditional response `304` while cache has body `old` → the `304` has no message body; the cache may reuse `old`. L3; targets cached-body/message-body confusion.

**Implementation and validation.** A body-semantics table independent of the renderer checks status/method combinations. The renderer must visually distinguish response content from cached content.

**Coverage.** Cover ordinary bodies, explicit empty body, HEAD, `204`, `304`, metadata-only responses, and every contradiction transform.

### Cross-family progression

Teach URL delimiters before percent encoding; then interleave them so decoding never precedes structure recognition. Request anatomy precedes response anatomy. Once both are stable, use paired Accept/Content-Type and `304`/cached-body contrasts before introducing method, negotiation, and caching categories.

## 3. Category: Methods and status semantics

### Category purpose

Train selection and interpretation of HTTP control vocabulary based on intended effects and observed outcomes.

### Learn

Methods state what the client is asking for. Safety concerns requested effects; idempotency concerns the intended effect of repetition. Neither says that responses must be identical.

Statuses describe the result of this request at this server/intermediary. Choose the most specific status justified by displayed facts, not merely the right hundred-class.

### Prerequisites

Request/response anatomy.

### Category boundaries

Server framework routing remains synthetic. Transport retry and packet retransmission belong to Networking and Protocols; this category considers only whether repeating an HTTP request is semantically compatible with its declared method/application contract.

### Subcategories

1. Method properties
2. Method selection and retry
3. Status interpretation
4. Status selection

### Family `method_properties`

**Skill and mental operation.** Classify a method as safe and/or idempotent and infer only the guarantees those properties justify.

**Response and template.** Two yes/no fields plus implication choice. `Under {profile}, classify {method}: safe? idempotent? Which statement about repetition follows?`

**Generated data.** `{profile}` is the standard table or a printed application override. `{method}` is one of the seven core methods.

**Derivation and accepted answers.** Look up standardized intent, apply any explicit stronger application contract, then select the implication that speaks about intended effects rather than response equality or automatic retry.

**Constraints and rejection.** Overrides may strengthen POST/PATCH idempotency for a named operation but never redefine standardized safety. Reject context stories whose business operation contradicts the method without making “semantic mismatch” the task.

**Variations and difficulty.** L1 safe method; L2 idempotent unsafe method; L3 non-idempotent method; L4 application idempotency key/contract contrasted with method default.

**Misconceptions and distractors.** `safe_equals_no_side_effects`, `idempotent_equals_same_response`, `all_read_named_routes_safe`, `delete_not_idempotent_because_second_404`, `put_nonidempotent_because_updates`.

**Feedback.** Show the two independent axes and compare the effect after one versus two identical intended requests.

**Examples.**

1. `GET` → safe yes, idempotent yes. Incidental logging does not make the requested semantics unsafe. L1.
2. `DELETE /items/7` → safe no, idempotent yes; a later `404` can differ while the intended final absence is unchanged. L2.
3. `POST /charges` with no idempotency contract → safe no, idempotent not assumed; blind replay may create another charge. L3.

**Implementation and validation.** Use a method-property matrix plus explicit override schema. Exhaust every core method and verify no distractor asserts response-byte equality.

**Coverage.** Keep safe/unsafe and idempotent/non-idempotent contrasts frequent; do not let GET dominate.

### Family `method_selection`

**Skill and mental operation.** Select the method whose standardized intent best matches a bounded resource operation.

**Response and template.** Single choice. `Choose the most appropriate method for this modeled API operation: {operation}. The server contract is {contract}.`

**Generated data.** `{operation}` names retrieve metadata/content, replace known resource state, create/process subordinate input, partially modify, delete, inspect capabilities, or retrieve headers only. `{contract}` states URI ownership and replacement/partial semantics.

**Derivation and accepted answers.** Map operation intent to GET/HEAD/POST/PUT/PATCH/DELETE/OPTIONS. The URI and full-versus-partial update facts are decisive.

**Constraints and rejection.** Exactly one best method under the printed contract. No framework conventions, RPC-over-POST debates, bulk operations, tunneling, or unsupported WebDAV methods. Reject vague “update this” prompts lacking replacement/partial detail.

**Variations and difficulty.** L1 retrieve/delete; L2 POST creation versus PUT known URI; L3 PUT replacement versus PATCH partial change; L4 diagnose unsafe GET or choose HEAD/OPTIONS.

**Misconceptions and distractors.** `post_for_every_write`, `put_for_any_update`, `get_for_action_link`, `head_returns_small_body`, `options_is_health_check`.

**Feedback.** Restate the operation as retrieve, replace, partially modify, process/create, delete, metadata-only retrieval, or capability inquiry.

**Examples.**

1. Retrieve `/articles/7` → GET. L1.
2. Replace the complete state at client-chosen `/profiles/ada` → PUT. L2; POST is not selected merely because data is sent.
3. Increment only `login_count` while preserving unspecified fields → PATCH under the displayed patch contract. L3; targets PUT/partial confusion.

**Implementation and validation.** Generate from an operation-intent enum and method mapping, then render stories. Reverse-generate distractors from neighboring intent enums.

**Coverage.** Balance all core methods; include URI-known/unknown and complete/partial pairs.

### Family `http_retry_semantics`

**Skill and mental operation.** Decide whether a synthetic user agent may automatically repeat an HTTP-level operation under an explicit retry policy without assuming transport facts.

**Response and template.** Decision plus reason label. `The client observed {observation}. Request {request} has {application_contract}. Under retry policy {policy}, may it repeat automatically?`

**Generated data.** `{observation}` is no HTTP response observed, `503` with/without displayed retry permission, or completed response lost in the synthetic trace. `{application_contract}` may include an opaque idempotency key recognized by the server. `{policy}` explicitly permits only declared idempotent operations and/or keyed POST.

**Derivation and accepted answers.** Determine standardized/application idempotency, then apply the printed policy. Do not infer whether the first request reached the server from absence of a response.

**Constraints and rejection.** This is not TCP retransmission. The policy fully determines the answer. No real payment advice or claims that retry is universally safe.

**Variations and difficulty.** L1 GET; L2 PUT/DELETE with different possible response; L3 unkeyed POST uncertainty; L4 keyed POST and policy gates.

**Misconceptions and distractors.** `no_response_means_not_received`, `retry_only_safe_methods`, `idempotent_requires_same_status`, `idempotency_key_magic_without_contract`.

**Feedback.** Separate observation, possible first execution, method/application idempotency, and client policy.

**Examples.**

1. GET, no response observed, policy retries idempotent requests once → retry permitted. L1.
2. DELETE returned no observable response; second request may get `404`, but policy permits idempotent methods → retry permitted. L2.
3. POST create-order, response lost, no key/contract → automatic retry denied by the policy because duplicate creation remains possible. L3.

**Implementation and validation.** Use a truth table over method property, application contract, observation, and policy. Reject any generated explanation that deduces server receipt from silence.

**Coverage.** Balance permitted/denied, response/no-response, standardized/application idempotency, and status-change cases.

### Family `status_interpretation`

**Skill and mental operation.** Interpret a displayed status without overclaiming what it proves.

**Response and template.** Status class, controlled meaning label, and supported-inference set. `Response is {status} with {relevant_fields}. Classify it and select every inference supported by the evidence.`

**Generated data.** `{status}` comes from the bounded table; `{relevant_fields}` supplies `Location`, `Allow`, challenge, or `Retry-After` when required by the scenario.

**Derivation and accepted answers.** Map status to its teaching meaning, then test each inference against only displayed evidence. A response proves an HTTP response was produced, not which lower-layer component was healthy beyond the supplied exchange.

**Constraints and rejection.** Choices have a unique truth set. Avoid reason-phrase tricks and statuses whose meaning needs omitted extensions.

**Variations and difficulty.** L1 class/meaning; L2 required supporting field; L3 distinguish origin/intermediary status; L4 evidence limitation.

**Misconceptions and distractors.** `404_means_dns_failed`, `401_means_forbidden_forever`, `202_means_completed`, `502_means_origin_500`, `304_is_redirect`.

**Feedback.** State what the status says, then list what remains unknown.

**Examples.**

1. `202 Accepted` → request accepted for later processing; completion is not proven. L1.
2. `405` with `Allow: GET, HEAD` → target does not support attempted method under this response; GET/HEAD are advertised. L2.
3. CDN returns `504` waiting for origin → gateway timeout; it does not prove the origin process crashed. L3.

**Implementation and validation.** Maintain a versioned status implication matrix with required/optional fixture fields. A logic-set oracle verifies inference choices.

**Coverage.** Exercise every bounded status, all classes, required metadata, and “unknown” distinctions; common statuses should recur without excluding rarer bounded contrasts.

### Family `status_selection`

**Skill and mental operation.** Choose the most precise status justified by a deterministic server/intermediary outcome.

**Response and template.** Status choice plus optional required-field selection. `For request {request}, the modeled outcome is {outcome}. Choose the response status and any required field from {field_options}.`

**Generated data.** `{request}` supplies method, target, representation type, authentication state, and conditions as relevant. `{outcome}` is one node in a status-decision AST. `{field_options}` includes `Location`, `Allow`, challenge, or none.

**Derivation and accepted answers.** Evaluate the AST in printed order: syntax/media support, authentication/authorization, target/method, preconditions/conflict, processing, and completion. Choose the leaf status.

**Constraints and rejection.** Facts distinguish `400/415/422`, `401/403`, `404/405`, `409/412`, `500/502/503/504`, and `200/201/202/204`. Reject vague business errors or multiple valid design choices.

**Variations and difficulty.** L1 ordinary success/not found; L2 paired 4xx; L3 conditional/conflict and async outcomes; L4 origin-versus-gateway failure with required metadata.

**Misconceptions and distractors.** Named pair confusions above plus `all_success_200` and `all_server_failures_500`.

**Feedback.** Show the first decision predicate whose outcome selects the leaf and why the closest alternative requires a different fact.

**Examples.**

1. POST creates `/jobs/9` immediately → `201` with `Location: /jobs/9`. L1.
2. JSON syntax is valid and supported, but required field `title` violates the declared semantic schema → `422`, not `400` or `415`. L3.
3. Gateway's upstream deadline expires without a usable origin response → `504`, not origin `500` or gateway `502`. L4.

**Implementation and validation.** Generate from typed outcome leaves and independently run the status-decision AST. Ensure exactly one choice and required field combination is correct.

**Coverage.** Track every contrast pair, success completion state, client/server/intermediary source, and required-field occurrence.

### Cross-family progression

Teach direct method properties before method selection, then retry policy. Teach status interpretation before selection. Interleave method/status pairs only after both directions are stable: POST-created/`201`, async POST/`202`, DELETE/`204`, unsupported method/`405`, conditional request/`304` or `412`.

## 4. Category: Fields, media types, and content negotiation

### Category purpose

Train the ability to connect header fields to the decisions they control and to select a representation through explicit metadata.

### Learn

Field names are case-insensitive, but values follow field-specific grammars. `Content-Type` labels the representation being sent. `Accept` ranks representations the client is willing to receive. `Vary` tells caches which request fields participated in selection.

### Prerequisites

Message anatomy and decimal comparison through thousandths.

### Category boundaries

This category does not frame HTTP/1 messages, decompress content, sniff bytes, parse multipart bodies, or implement a complete registry. Cache consequences of `Vary` are practiced later.

### Subcategories

1. Field roles and effects
2. Media-type metadata
3. Proactive negotiation

### Family `header_role_effect`

**Skill and mental operation.** Match each generated field to its direction, parsed value, and modeled decision effect.

**Response and template.** Matching/table completion. `For exchange {exchange}, complete the role and effect of fields {fields}.`

**Generated data.** `{fields}` contains 3–8 of `Accept`, `Content-Type`, `Location`, `Allow`, `Retry-After`, `Cache-Control`, `Age`, `ETag`, `Last-Modified`, `If-None-Match`, `Vary`, `Set-Cookie`, `Cookie`, `Origin`, and CORS allow fields.

**Derivation and accepted answers.** Parse each through its restricted field grammar and apply the category owner: representation, redirect, method availability, caching, validation, cookie state, or CORS policy.

**Constraints and rejection.** Effects must be exercised in a concrete exchange, not vocabulary-only. No ambiguous combined field lines or fields outside implemented parsers.

**Variations and difficulty.** L1 direction/role; L2 distinguish similarly named pairs; L3 determine a direct effect; L4 find a field that cannot justify a claimed outcome.

**Misconceptions and distractors.** `request_response_pair_swap`, `age_is_resource_age`, `location_is_origin_authority`, `allow_is_cors_allow_methods`, `vary_selects_response_directly`.

**Feedback.** Link each field to the exact simulator predicate it affects and state what it does not control.

**Examples.**

1. `Content-Type: application/json` on a response → selected representation is labeled JSON. L1.
2. `Age: 40` → informs cache current-age calculation; it does not mean the resource was created 40 seconds ago. L2.
3. `Allow: GET, HEAD` describes methods for a target; it does not grant a CORS preflight (`Access-Control-Allow-Methods` does). L3.

**Implementation and validation.** A field registry stores direction, restricted parser, owner, and misconception transforms. Schema-enumerate all supported fields.

**Coverage.** Balance request/response, representation/control/state fields, and every confusing pair.

### Family `media_type_metadata`

**Skill and mental operation.** Parse or construct a media type and decide which claims representation metadata supports.

**Response and template.** Named fields or controlled choice. `Given Content-Type {content_type} and representation {representation}, identify type, subtype, parameters, and supported interpretation.`

**Generated data.** `{content_type}` uses `text/plain`, `text/html`, `application/json`, `application/pdf`, `image/png`, `image/svg+xml`, `application/octet-stream`, and controlled `charset=utf-8` parameters only on media types for which the fixture profile defines that parameter. `{representation}` is a short labeled body/byte signature used only when the question asks consistency.

**Derivation and accepted answers.** Split type/subtype and semicolon parameters with a restricted tokenizer. Media type labels the enclosed representation; a charset parameter describes character encoding where meaningful in the fixture.

**Constraints and rejection.** No MIME sniffing as browser behavior, vendor trees, quoted-parameter edge cases, default charset folklore, multipart, or content coding. Consistency questions use curated unambiguous representations.

**Variations and difficulty.** L1 parse; L2 choose type for known representation; L3 distinguish resource/representation and charset; L4 diagnose mislabeled fixture without prescribing browser sniffing.

**Misconceptions and distractors.** `extension_is_authoritative`, `charset_is_media_subtype`, `content_type_is_accept`, `resource_has_one_permanent_type`, `json_requires_text_json`.

**Feedback.** Show `type/subtype; parameter=value` and distinguish label, bytes, and client preference.

**Examples.**

1. `text/plain; charset=utf-8` → type `text`, subtype `plain`, charset `utf-8`. L1.
2. PNG bytes selected for `/logo` → appropriate generated metadata `image/png`; URL lacks a required extension. L2.
3. `/report` may have JSON and PDF representations; `Content-Type` labels the selected one, not the resource permanently. L3.

**Implementation and validation.** Use a media-type AST and canonical serializer. Parse/serialize round trips and a curated representation/type matrix provide validation.

**Coverage.** Balance textual/binary, structured suffix, parameter/no parameter, construct/parse, and consistent/inconsistent examples.

### Family `accept_negotiation`

**Skill and mental operation.** Rank available representations using the pinned `Accept` precedence and quality rules.

**Response and template.** Representation choice or `406`, plus matched range and quality. `Request Accept is {accept}. Server offers {representations} in preference order. Which representation is selected?`

**Generated data.** `{accept}` has 1–5 ranges with valid `q`; `{representations}` has 2–5 distinct media types and stable preference indexes. At least one comparison dimension is decisive.

**Derivation and accepted answers.** For each representation choose its most specific matching range, assign q, discard q=0/no match, and rank by q, matched specificity/parameters, then server preference.

**Constraints and rejection.** Exactly one selected representation or deterministic `406`. Reject duplicate ranges whose precedence would require unmodeled general parser behavior, floating-point q, or ties not broken by server preference.

**Variations and difficulty.** L1 exact versus wildcard; L2 q ranking; L3 specific exclusion overriding broad acceptance; L4 parameters and server tie-break or inverse construction.

**Misconceptions and distractors.** `first_accept_wins`, `most_specific_always_wins_globally`, `wildcard_overrides_q0`, `server_order_before_q`, `missing_accept_means_none`.

**Feedback.** Produce one row per representation: controlling range, q, specificity, server index; highlight first differing rank key.

**Examples.**

1. `Accept: application/json` with JSON and HTML → JSON. L1.
2. `text/*;q=0.5, application/json;q=0.9` with HTML and JSON → JSON at `0.9`. L2.
3. `*/*;q=0.8, text/html;q=0` with HTML and JSON → JSON; HTML's more-specific range gives it q=0. L3; targets wildcard-overrides-exclusion.

**Implementation and validation.** Parse q as integer thousandths, never binary floating point. Compare a direct scorer with an independently generated precedence table; permutation tests preserve results except declared order tie-breaks.

**Coverage.** Include missing Accept, exact/type/global wildcards, q=0/q=1, ties, no acceptable representation, parameters, and every misconception.

### Family `negotiation_response_fields`

**Skill and mental operation.** Complete the status and representation/cache metadata after a negotiation decision.

**Response and template.** Multiple named fields. `For Accept {accept}, available variants {variants}, and cache policy {policy}, complete status, Content-Type, and Vary.`

**Generated data.** Inputs reuse `accept_negotiation`; `{policy}` states whether variant selection truly depends on `Accept` and whether response is cacheable.

**Derivation and accepted answers.** Run negotiation. If none, choose `406` under this route contract. Otherwise choose `200`, selected `Content-Type`, and `Vary: Accept` when caches could otherwise reuse a response selected by Accept.

**Constraints and rejection.** No other negotiation dimensions. Exactly one outcome; reject redundant variants with same media type and indistinguishable metadata.

**Variations and difficulty.** L1 Content-Type; L2 `406`; L3 Vary consequence; L4 compare two requests and decide reusable variant.

**Misconceptions and distractors.** `echo_accept_as_content_type`, `omit_vary`, `vary_star`, `fallback_ignores_q0`, `406_for_missing_accept`.

**Feedback.** Chain request preference → selection → response label → cache-key metadata.

**Examples.**

1. Accept JSON, JSON selected → `200`, `Content-Type: application/json`, `Vary: Accept`. L1.
2. Accept `image/png;q=1, */*;q=0`, only JSON/HTML → `406`. L2.
3. No Accept, server selects HTML under wildcard default → `200 text/html`; if route always returns HTML regardless of Accept, generated policy may omit Vary. L3.

**Implementation and validation.** Compose the negotiation oracle with a Vary-dependency predicate. Mutation-test by changing Accept and verifying Vary is present whenever selection changes.

**Coverage.** Balance success/406, media types, variant dependence/independence, and cacheable/noncacheable policies.

### Cross-family progression

Field-role matching precedes media parsing. Direct negotiation follows, then response-field completion. Later cache-key families reuse `Vary`; they must not appear until the learner can compute a negotiation result.

## 5. Category: Redirects and navigation traces

### Category purpose

Train URL resolution and state transitions across bounded redirect chains.

### Learn

A redirect response supplies a new URL reference. The user agent resolves it, applies the status-specific method rule, drops or preserves content as required, and creates a new request. Each hop is a new HTTP exchange; a chain can change origin and can loop.

### Prerequisites

URL components, method properties, and redirect status interpretation.

### Category boundaries

No DNS, TCP, TLS, browser-history behavior, HSTS, HTML/meta refresh, or JavaScript navigation. `304` is a cache-validation response, never a navigation redirect.

### Subcategories

1. Location resolution
2. Method transition
3. Redirect chains

### Family `redirect_location_resolve`

**Skill and mental operation.** Resolve a controlled `Location` reference against the current response URL.

**Response and template.** URL input. `Current URL is {base_url}. Resolve Location: {location}.`

**Generated data.** `{base_url}` is an absolute core URL with 1–4 path segments. `{location}` is absolute URL, scheme-relative, absolute-path, relative-path with optional dot segments, query-only, or fragment-only.

**Derivation and accepted answers.** Parse base/reference, replace or merge components per profile, remove dot segments, inherit untouched components, and serialize canonical scheme/host/effective-port policy.

**Constraints and rejection.** One resolution; no backslash, empty authority, abnormal percent triplet, userinfo, or encoded dot-segment ambiguity. Reject bases whose last-segment merge is visually indiscernible.

**Variations and difficulty.** L1 absolute path; L2 relative sibling; L3 parent/query/scheme-relative; L4 fragment and query inheritance or inverse missing Location.

**Misconceptions and distractors.** `append_to_full_filename`, `keep_old_query`, `resolve_from_origin_root`, `percent_decode_dot_first`, `location_must_be_absolute`.

**Feedback.** Show base directory, component inheritance/replacement, dot-segment stack, and final URL.

**Examples.**

1. base `https://app.test/a/b`, Location `/login` → `https://app.test/login`. L1.
2. base `https://app.test/a/b`, Location `next?q=1` → `https://app.test/a/next?q=1`. L2.
3. base `https://app.test/a/b?old=1`, Location `../c` → `https://app.test/c`; old query is not retained. L3.

**Implementation and validation.** Use a component resolver independent from the display parser; resolution then relativization fixtures provide reversible checks where unique.

**Coverage.** Balance all reference forms, port/origin changes, query replacement, and dot-segment depths.

### Family `redirect_method_transition`

**Skill and mental operation.** Determine the next request method, target, content, and representation fields after one redirect.

**Response and template.** Multiple named fields. `Request {request} receives {status} with Location {location}. Under the pinned redirect profile, construct the next request.`

**Generated data.** `{request}` has GET/HEAD/POST for `301/302`, any core body-capable method for `303/307/308`, and 0–4 relevant fields. `{location}` may change origin.

**Derivation and accepted answers.** Resolve URL; apply status method rule; if rewritten to GET, remove content and content-specific fields; recompute target, Host, cookies, cache lookup, and sensitive fields.

**Constraints and rejection.** One hop, deterministic profile. No replayability/user-confirmation UI, streaming bodies, custom sensitive fields, or ambiguous `301/302` methods.

**Variations and difficulty.** L1 GET preserve; L2 POST→GET on 303/302; L3 POST/PUT preserve on 307/308; L4 cross-origin field/cookie recomputation.

**Misconceptions and distractors.** `all_redirects_get`, `all_redirects_preserve`, `keep_body_after_get_rewrite`, `reuse_old_host_cookie`, `fragment_in_target`.

**Feedback.** Use columns for old request, status rule, resolved URL, and new request; mark dropped/recomputed fields.

**Examples.**

1. GET `/old` receives `301 Location: /new` → GET `/new`. L1.
2. POST `/submit` body `x` receives `303 Location: /done` → GET `/done`, no body/Content-Type. L2.
3. PUT `/object` body `v2` receives `307 Location: https://api.test/object` → PUT is preserved with body; Host/cookies are recomputed for `api.test`. L4.

**Implementation and validation.** A redirect transition reducer consumes typed request/response and returns the next request. Invariants check rewrite/body consistency and origin-sensitive field handling.

**Coverage.** Cover each redirect status, preserve/rewrite, same/cross origin, relative/absolute Location, and body/no-body.

### Family `redirect_chain_trace`

**Skill and mental operation.** Execute a bounded sequence of redirect responses to find final URL, method, request count, and termination reason.

**Response and template.** Ordered timeline plus named final fields. `Starting with {request}, follow redirect table {responses} with limit {limit}.`

**Generated data.** `{responses}` is a deterministic mapping from `(URL, method)` to redirect or terminal response, containing 1–5 followed hops. `{limit}` is 1–5.

**Derivation and accepted answers.** Repeatedly apply location resolution and method transition, record each request/response, and stop on nonredirect, repeated request state, missing mapping, or limit before another hop.

**Constraints and rejection.** Exactly one termination label: `terminal response`, `redirect loop`, or `redirect limit`. Missing mapping is generated only as a diagnosis variant labeled `fixture inconsistency`. Reject chains with two equivalent loop detection points.

**Variations and difficulty.** L1 one hop; L2 relative multi-hop; L3 method rewrite then preserve; L4 cross-origin cookies/cache plus loop/limit.

**Misconceptions and distractors.** `count_responses_not_requests`, `304_as_redirect`, `resolve_all_locations_against_start`, `method_rule_from_first_status_forever`, `loop_by_url_only_when_method_differs`.

**Feedback.** Show numbered states `(URL, method)` and the exact termination check.

**Examples.**

1. GET `/a` →302 `/b`→200 → final `/b`, two requests, terminal. L1.
2. POST `/start`→303 `/view`; GET `/view`→307 `next`; GET `/next`→200 → three requests, final GET. L3.
3. GET `/a`→301 `/b`; GET `/b`→302 `/a` → repeated `(GET,/a)`, redirect loop. L3.

**Implementation and validation.** Generate a transition graph, then simulate independently. Require unique labeled state sequence and test loop/limit off-by-one boundaries.

**Coverage.** Balance statuses, path forms, same/cross-origin, terminal classes, method changes, and chain lengths without letting maximum-length chains dominate.

### Cross-family progression

Location resolution precedes method transition. Interleave one-hop exercises until both are stable, then introduce chains. Cache/cookie effects can be added to chains only after the corresponding standalone categories are mastered.

## 6. Category: HTTP caching and conditional requests

### Category purpose

Train exact, stateful decisions about storage, freshness, reuse, validation, and cache metadata.

### Learn

A cache stores a response representation and metadata under a key. Storage permission, freshness, and reuse are separate decisions:

1. may this cache store the response?
2. if stored, what is its freshness lifetime and current age?
3. may it answer this request directly, must it validate, or must it contact the origin without using the entry?

Validators let a client ask whether stored content is still usable. A `304` supplies metadata but no new body.

### Prerequisites

Response anatomy, integer seconds, field roles, status semantics, and `Vary`.

### Category boundaries

DNS TTL and ARP/neighbor caches belong to Networking and Protocols and are unrelated to HTTP freshness. This category does not model browser disk quotas, service-worker Cache API, heuristic freshness, byte ranges, request collapsing, offline mode, or undocumented CDN behavior.

### Subcategories

1. Storage permission and freshness lifetime
2. Current age and reuse
3. Validators and preconditions
4. Stateful cache timelines

### Family `cache_storage_decision`

**Skill and mental operation.** Decide whether a private or shared cache stores a generated response and identify the decisive directive/policy.

**Response and template.** Decision plus reason label. `{cache_kind} receives {request} and {response} under {policy}. Store the response?`

**Generated data.** `{cache_kind}` is private or shared. `{request}` is normally GET. `{response}` has status, `Cache-Control`, optional explicit expiration/validator, and authentication context. `{policy}` supplies any cacheability fact not in the core profile.

**Derivation and accepted answers.** Check `no-store`; shared `private`; method/status cacheability; authorization/shared policy; then store if permitted. `no-cache` does not prohibit storage.

**Constraints and rejection.** Exactly one decisive first prohibition or explicit permission. Authorization cases include the complete shared-cache rule as a fixture predicate rather than expecting unstated RFC exceptions. Reject responses with conflicting directives unless conflict resolution is the named advanced variation.

**Variations and difficulty.** L1 explicit max-age/store; L2 no-store versus no-cache; L3 private/shared contrast; L4 authenticated request with explicit shared-cache policy.

**Misconceptions and distractors.** `no_cache_means_no_store`, `private_means_browser_cannot_store`, `validator_required_to_store`, `all_get_responses_cacheable`, `authorization_never_cacheable`.

**Feedback.** Show a gate sequence: store prohibition → cache kind → cacheability policy. State that reuse is a later decision.

**Examples.**

1. Private cache, GET `200`, `Cache-Control: max-age=60` → store. L1.
2. Private cache, `Cache-Control: no-cache` → may store, but must validate before reuse. L2.
3. Shared cache, `Cache-Control: private, max-age=300` → do not store in shared cache; a private cache could. L3.

**Implementation and validation.** Use a declarative storage predicate table independent of freshness code. Exhaust directive/cache-kind combinations and mutation-test `no-cache` versus `no-store`.

**Coverage.** Balance store/do-not-store, private/shared, explicit cacheable statuses, validators, authentication policy, and each prohibition.

### Family `freshness_lifetime`

**Skill and mental operation.** Compute freshness lifetime from response directives and dates using explicit precedence.

**Response and template.** Integer seconds plus source label. `For a {cache_kind} cache, response metadata is {metadata}. What is its freshness lifetime and which rule supplies it?`

**Generated data.** `{metadata}` contains `Date`, zero or one `Expires`, `max-age`, and optional `s-maxage`. Values are integer seconds 0–86,400; an HTTP-date display is paired with timeline values.

**Derivation and accepted answers.** Shared `s-maxage` overrides `max-age`; otherwise use `max-age`; otherwise `max(0, Expires-Date)`; otherwise zero.

**Constraints and rejection.** Values fit exact integer arithmetic. Duplicate directives, invalid dates, heuristic freshness, and clock ambiguity are excluded. Reject cases where multiple supplied rules have equal numeric results unless testing precedence explicitly.

**Variations and difficulty.** L1 max-age; L2 Expires-Date; L3 shared/private s-maxage contrast; L4 inverse missing directive or precedence despite coincidental-looking dates.

**Misconceptions and distractors.** `expires_is_duration`, `age_subtracted_from_lifetime`, `s_maxage_for_private`, `largest_duration_wins`, `missing_freshness_means_forever`.

**Feedback.** Display the precedence ladder and calculate only the selected source. Clarify that current age is compared later.

**Examples.**

1. `max-age=120` → lifetime `120 s`. L1.
2. Date t=100, Expires t=340, no max-age → `240 s`. L2.
3. `max-age=600, s-maxage=90` → shared lifetime `90 s`; private lifetime `600 s`. L3.

**Implementation and validation.** Two independent implementations—directive decision table and candidate-priority reducer—must agree. Boundary-test zero and Expires before Date.

**Coverage.** Balance all sources, absent/zero lifetime, private/shared contrasts, precedence, and inverse cases.

### Family `cache_current_age`

**Skill and mental operation.** Calculate current age from request/response timing, `Date`, `Age`, and resident time.

**Response and template.** Multiple named integer fields. `Using {timing}, compute apparent_age, response_delay, corrected_initial_age, resident_time, and current_age at now={now}.`

**Generated data.** `{timing}` supplies request_time ≤ response_time ≤ now, `Date`, and nonnegative `Age`, all 0–100,000 seconds. Values are constructed so one of apparent age or corrected age is decisively larger.

**Derivation and accepted answers.** Apply the normative formula exactly. Intermediate fields are required above L1 so the first arithmetic/rule error is diagnosable.

**Constraints and rejection.** Integer-only, no overflow, no negative delay. Reject arithmetic requiring more than three-digit subtraction at L1/L2 or cases where both max operands tie unless tie is intentional.

**Variations and difficulty.** L1 resident time with zero delays; L2 nonzero Age; L3 clock/date apparent age versus corrected age; L4 solve a missing timing value from current age.

**Misconceptions and distractors.** `current_age_is_age_header`, `subtract_age_from_now`, `ignore_response_delay`, `add_both_apparent_and_corrected`, `freshness_lifetime_is_age`.

**Feedback.** Fill the formula line by line and highlight the `max`, not a sum, for corrected initial age.

**Examples.**

1. request t=0, response t=0, Date=0, Age=0, now=30 → current age `30 s`. L1.
2. request t=10, response t=12, Date=12, Age=20, now=42 → corrected age value 22, resident 30, current age `52 s`. L2.
3. request t=100, response t=104, Date=80, Age=3, now=114 → apparent 24, corrected value 7, initial 24, resident 10, current age `34 s`. L3.

**Implementation and validation.** Use exact integer fields and compare direct formula with event-timeline accumulation. Property checks assert current age never decreases as `now` advances.

**Coverage.** Vary which max branch wins, zero/nonzero delay/Age, resident time, exact boundaries, and forward/inverse direction.

### Family `cache_freshness_decision`

**Skill and mental operation.** Combine lifetime, current age, request directives, and response revalidation requirements to choose direct reuse, validation, or miss.

**Response and template.** Controlled decision. `{cache_kind} has {entry} and receives {request_at_now}. Choose: serve stored response, validate, or cannot use entry.`

**Generated data.** `{entry}` includes storage permission, key match, lifetime/current-age inputs, `no-cache`/`must-revalidate`, and optional validator. `{request_at_now}` includes optional `no-cache` or request `max-age`.

**Derivation and accepted answers.** First require a stored key match; compute age/lifetime; apply request restrictions and response `no-cache`; serve only when all allow. If reuse requires validation and a validator exists, choose validate; without one choose origin/miss.

**Constraints and rejection.** Stale reuse extensions excluded. “Cannot use entry” means make an ordinary origin request, not network failure. Reject cases with both key mismatch and directive failure unless diagnosing first divergence.

**Variations and difficulty.** L1 fresh/stale boundary; L2 response no-cache; L3 request no-cache/max-age; L4 stale entry with/without validator and must-revalidate.

**Misconceptions and distractors.** `equal_lifetime_is_fresh`, `no_cache_is_delete`, `etag_makes_stale_fresh`, `stale_can_always_serve`, `request_max_age_changes_response_lifetime`.

**Feedback.** Show key match, `current_age < lifetime`, request gates, and validator availability in order.

**Examples.**

1. age 59, lifetime 60 → serve stored response. L1.
2. age 60, lifetime 60, strong ETag present → stale; validate, because equality is not fresh. L2.
3. age 10/lifetime 100 but response says `no-cache`, ETag `"v1"` → validate before reuse despite freshness arithmetic. L3.

**Implementation and validation.** Compose storage/key/freshness/directive predicates. Exhaust equality boundaries and ensure every decision has one first reason.

**Coverage.** Balance all three outcomes, exact boundary, request/response directives, validators, and cache kinds.

### Family `validator_comparison`

**Skill and mental operation.** Select the applicable validator comparison and determine whether entity tags or modification dates match.

**Response and template.** Comparison kind and Boolean/result set. `Stored metadata is {stored}. Conditional fields are {conditions}. Evaluate the applicable validator comparison.`

**Generated data.** `{stored}` has strong/weak ETag and/or Last-Modified. `{conditions}` contains `If-Match`, `If-None-Match`, `If-Modified-Since`, or `If-Unmodified-Since`, with advanced precedence pairs.

**Derivation and accepted answers.** Apply field precedence; use strong comparison for If-Match and weak comparison for If-None-Match; compare dates at whole seconds. `*` variants occur only with explicit existence state.

**Constraints and rejection.** Valid quoted ETags; lists at most 4; exactly one applicable branch. Reject weak/strong pairs whose opaque tags differ when the goal is comparison-strength contrast.

**Variations and difficulty.** L1 identical strong tags; L2 weak comparison/list; L3 date; L4 precedence or wildcard existence.

**Misconceptions and distractors.** `strip_weak_for_if_match`, `weak_never_matches`, `both_date_and_etag_must_pass`, `newer_if_modified_since_means_modified`, `etag_case_fold`.

**Feedback.** Identify chosen conditional field, comparison strength, normalized candidates, and match result.

**Examples.**

1. stored `"v2"`, `If-None-Match: "v2"` → weak comparison matches. L1.
2. stored `W/"v2"`, `If-Match: "v2"` → no strong match because stored tag is weak. L2.
3. both `If-None-Match: "other"` and `If-Modified-Since` present → evaluate If-None-Match under precedence; date is ignored in this generated retrieval. L4.

**Implementation and validation.** Use separate strong/weak comparators and a conditional-precedence table. Exhaust tag weakness/list membership/wildcard and date equality boundaries.

**Coverage.** Balance match/nonmatch, strong/weak, lists, dates, precedence, and existence wildcard.

### Family `conditional_response_select`

**Skill and mental operation.** Convert a conditional evaluation into `200`/normal processing, `304`, or `412`.

**Response and template.** Status plus body-source label. `{method} {target} has current metadata {metadata}; request conditions are {conditions}. What response path follows?`

**Generated data.** `{method}` is GET/HEAD or a declared unsafe method. `{metadata}` and `{conditions}` are valid validator-family inputs. The normal success status/body is supplied.

**Derivation and accepted answers.** Evaluate preconditions in profile order. A not-modified If-None-Match/date result for GET/HEAD yields `304` without body; the equivalent false precondition on another method yields `412`; otherwise proceed to normal response.

**Constraints and rejection.** No range requests. Exactly one terminal result. Unsafe-method scenarios state the resource existence/current tag and intended mutation.

**Variations and difficulty.** L1 GET ETag `304`; L2 changed representation `200`; L3 unsafe method `412`; L4 precedence combination.

**Misconceptions and distractors.** `matching_inm_means_send_200`, `304_contains_stored_body`, `all_nonmatches_412`, `304_for_put`, `last_modified_always_wins`.

**Feedback.** Show comparison result, method branch, status, and whether body comes from network, existing cache, or nowhere yet.

**Examples.**

1. GET, current ETag `"v2"`, `If-None-Match: "v2"` → `304`, no response body. L1.
2. GET, current `"v3"`, condition `"v2"` → normal `200` with current representation. L2.
3. PUT with `If-Match: "v2"` while current is `"v3"` → `412`; mutation is not applied. L3.

**Implementation and validation.** Compose validator oracle with a method/outcome table and resource-state transition invariant (failed precondition leaves state unchanged).

**Coverage.** Balance 200/304/412, GET/HEAD/unsafe, ETag/date, and state changed/unchanged.

### Family `cache_validation_merge`

**Skill and mental operation.** Update a stored entry after a generated `304` and determine the representation served and new metadata.

**Response and template.** Updated cache-entry fields plus served body. `Cache entry {stored_entry} is validated by exchange {validation}. Show the resulting entry and response to the client.`

**Generated data.** `{stored_entry}` has body, validators, Date, age inputs, freshness metadata, and Vary. `{validation}` has request timing and a `304` containing a subset of permitted metadata fields.

**Derivation and accepted answers.** Preserve stored body; replace listed metadata fields with `304` values; retain other generated metadata; recompute age/freshness baseline from the validation exchange; serve the stored body if validation succeeds.

**Constraints and rejection.** Only the profile's merge field set; no warnings, partial content, content coding, or conflicting Vary. Reject cases where no visible metadata changes and freshness remains zero.

**Variations and difficulty.** L1 body preservation/new ETag; L2 new max-age/Date; L3 Vary/Last-Modified; L4 compute later freshness after merge.

**Misconceptions and distractors.** `replace_body_with_empty`, `keep_all_old_metadata`, `304_is_redirect`, `age_continues_without_validation_reset`, `etag_change_requires_200`.

**Feedback.** Diff old entry, `304`, merged entry, then show body source and new age calculation.

**Examples.**

1. stored body `A`, ETag `"v1"`; `304` repeats `"v1"` → serve stored `A`, not an empty body. L1.
2. stored `max-age=0`; validating `304` gives `Cache-Control: max-age=120` and new Date → body stays, new lifetime 120. L2.
3. stored Last-Modified t=50; `304` supplies ETag `"v2"` and new Vary `Accept` → update those fields and preserve body. L3.

**Implementation and validation.** Use an immutable entry merge function. Snapshot tests assert allowed-field replacement and body identity; a second field-by-field oracle checks output.

**Coverage.** Vary every permitted metadata field, single/multiple updates, changed/unchanged validator, and later fresh/stale outcomes.

### Family `cache_timeline_trace`

**Skill and mental operation.** Execute a bounded browser/shared-cache/origin timeline and label each request as hit, validation, miss, or nonstored response.

**Response and template.** Ordered event table and final cache state. `Starting with {cache_state}, process events {timeline} under {cache_policy}.`

**Generated data.** `{cache_state}` has 0–4 entries. `{timeline}` has 2–8 ordered requests/responses/times, key/Vary values, and deterministic origin versions. `{cache_policy}` names cache kind and supported directives.

**Derivation and accepted answers.** For each request: compute key; evaluate entry/storage/freshness; generate conditional request if required; apply origin response; merge/store/replace; record client body/status source and final state.

**Constraints and rejection.** One cache layer at L1–L3; no concurrent requests, collapsed forwarding, eviction, heuristic/stale extensions, or unspecified origin response. L4 may compose private and shared caches but every lookup order is printed.

**Variations and difficulty.** L1 miss then fresh hit; L2 stale validation `304`; L3 representation changes `200`; L4 Vary/private/shared interactions.

**Misconceptions and distractors.** `hit_does_not_age`, `304_body_empty_to_client`, `vary_ignored`, `private_stored_shared`, `age_reset_on_ordinary_hit`.

**Feedback.** Show a row per event with time, key, age/lifetime, decision, network-simulator exchange, body source, and new state.

**Examples.**

1. t0 empty cache: GET→200 max-age60 body A; t30 GET → fresh hit A, one origin request total. L1.
2. same entry at t60 with ETag `"a"`; origin returns304 → validation occurs, stored A is served. L2.
3. stale `"a"` at t80; origin current `"b"` returns200 body B max-age40 → replace entry, serve B. L3.

**Implementation and validation.** A pure event reducer emits both observations and state. Replay determinism, conservation of body provenance, monotonic age, and final snapshot tests are mandatory.

**Coverage.** Balance cold/fresh/stale, 304/200 validation, directives, Vary keys, private/shared, and exact-expiry boundaries.

### Cross-family progression

Storage permission and freshness lifetime precede age. Interleave age and freshness decisions, then introduce validators, conditional statuses, and `304` merge. Timeline traces come last and initially combine only mastered dimensions.

## 7. Category: Cookies and simple sessions

### Category purpose

Train deterministic cookie-jar transitions and request selection while keeping cookies distinct from authorization and CORS.

### Learn

`Set-Cookie` updates a jar. Later, a user agent selects matching unexpired cookies by host/domain, path, scheme, site context, and credentials mode. Cookie attributes control storage/sending/script visibility; they are not sent back as part of the `Cookie` field.

A session cookie value is an opaque lookup key in these fixtures. Possessing it does not explain how authentication was established or whether an action is authorized.

### Prerequisites

URLs, requests/responses, and timeline tables.

### Category boundaries

No public-suffix algorithm, real browser storage, cryptographic session design, CSRF attacks/defenses, OAuth, JWT parsing, tracking, cookie theft, or browser-version quirks.

### Subcategories

1. Set-Cookie storage
2. Cookie request selection
3. Session timelines

### Family `set_cookie_jar_update`

**Skill and mental operation.** Apply one or more generated `Set-Cookie` fields to a cookie jar.

**Response and template.** Final table. `Response URL is {url} at time {now}. Apply Set-Cookie fields {set_cookie_fields} to jar {jar}.`

**Generated data.** `{url}` is HTTPS except Secure-rejection contrasts. `{set_cookie_fields}` contains 1–3 restricted cookies with optional Domain, Path, Max-Age/expiry, Secure, HttpOnly, and SameSite. `{jar}` has 0–5 entries.

**Derivation and accepted answers.** Validate attributes; derive host-only/domain and default path; compute expiry; reject invalid Domain or SameSite=None-without-Secure; replace equal `(name,domain,path)` tuple or delete with expired update.

**Constraints and rejection.** No duplicate attributes, Expires parsing ambiguity, public suffixes, quota eviction, or unspecified precedence between Max-Age and Expires (if both shown, the profile explicitly says Max-Age wins). Each rejected cookie has one primary reason.

**Variations and difficulty.** L1 new host-only cookie; L2 default/explicit path and replacement; L3 Domain/Secure/SameSite validation; L4 expiry deletion and same-name distinct paths.

**Misconceptions and distractors.** `domain_attribute_makes_host_only`, `same_name_always_replaces`, `path_is_response_file`, `httponly_not_stored`, `none_without_secure_accepted`.

**Feedback.** Normalize each candidate tuple, state accept/reject/replace/delete, then display jar diff.

**Examples.**

1. response `https://app.test/login`, `Set-Cookie: sid=A; Path=/; Secure` on empty jar → host-only `app.test`, path `/`, sid A stored. L1.
2. existing `theme=light` domain app.test path `/`; update `theme=dark; Path=/` → replace with dark. L2.
3. response from `app.test` sets `sid=A; Domain=other.test` → reject for domain mismatch. L3.

**Implementation and validation.** Use typed cookie tuples and immutable jar operations. Invariants enforce tuple uniqueness, expiry deletion, and accepted domain-match.

**Coverage.** Balance host-only/domain, default/explicit paths, all attributes, accept/reject, replacement/deletion, and same-name distinct tuples.

### Family `cookie_request_selection`

**Skill and mental operation.** Select and order cookies sent on a generated request.

**Response and template.** Ordered cookie pairs. `At {now}, jar {jar} makes {request_context}. Which Cookie pairs are sent, in what order?`

**Generated data.** `{jar}` has 2–8 valid entries. `{request_context}` supplies URL, method, top-level/subresource, initiator site key, target site key, credentials mode, and synthetic script/HTTP operation.

**Derivation and accepted answers.** For an HTTP request, filter expiry, domain/host-only, path, Secure, SameSite, and credentials mode, then sort by path length descending and creation index. For the separately labeled synthetic script-read operation, filter by current document URL, expiry, domain/host-only, path, and Secure, then exclude HttpOnly; SameSite and fetch credentials mode do not govern script visibility.

**Constraints and rejection.** “Send HTTP” and “script read” are distinct variants. Site keys are printed. Exactly one expected ordered sequence; reject identical names/paths with unclear display.

**Variations and difficulty.** L1 host/path; L2 Secure/expiry; L3 SameSite context; L4 credentials mode, HttpOnly contrast, and ordering.

**Misconceptions and distractors.** `send_attributes`, `httponly_never_sent`, `secure_means_encrypted_value`, `same_origin_equals_same_site`, `shorter_path_first`.

**Feedback.** Give one predicate row per cookie and then the ordering keys.

**Examples.**

1. host-only app.test path `/`, HTTPS request to app.test `/x` → send. L1.
2. Secure cookie on request `http://app.test/x` → omit. L2.
3. cross-site subresource GET: Strict and Lax cookies omitted; SameSite=None; Secure cookie may be sent if credentials mode includes it. L3.

**Implementation and validation.** A predicate pipeline records the first failed check for each cookie. Permutation tests on jar order must not change semantic selection/order except creation indexes.

**Coverage.** Balance each exclusion predicate, empty/nonempty headers, same-name cookies, path ordering, same/cross-site, navigation/subresource, and send/script-read.

### Family `cookie_scope_compare`

**Skill and mental operation.** Compare two URLs/contexts and identify exactly which cookie scope attributes change eligibility.

**Response and template.** Matching/difference set. `Cookie {cookie} is considered for contexts A={context_a} and B={context_b}. Is it included in each, and which predicate differs?`

**Generated data.** Contexts differ in exactly one or two of scheme, host/subdomain, path boundary, site key, method/navigation, time, or credentials mode.

**Derivation and accepted answers.** Apply the same selection pipeline to both and report the first differing predicate(s).

**Constraints and rejection.** Constructed minimal pairs; reject pairs where an earlier shared failure masks the intended difference or two differences cancel.

**Variations and difficulty.** L1 host/path; L2 Secure; L3 SameSite Lax; L4 host-only versus Domain combined with site/origin distinction.

**Misconceptions and distractors.** The standard cookie-selection misconception transforms, especially `domain_substring_match` and `path_directory_semantics`.

**Feedback.** Side-by-side predicate table; do not restate the whole jar.

**Examples.**

1. host-only app.test cookie: app.test yes, api.app.test no → host-only predicate differs. L1.
2. path `/docs`: `/docs/x` yes, `/docset` no under boundary rule. L2.
3. Lax cookie, cross-site top-level GET yes; same cross-site POST no in this profile. L3.

**Implementation and validation.** Generate backward from one desired predicate contrast; verify no unintended earlier predicate decides both outcomes.

**Coverage.** Exercise every scope dimension and inclusion transition in both directions.

### Family `session_cookie_trace`

**Skill and mental operation.** Follow a small login/session/logout-like exchange using opaque server session-table and cookie-jar state.

**Response and template.** Ordered state table. `Starting with cookie jar {jar} and server sessions {sessions}, process synthetic exchanges {events}.`

**Generated data.** `{sessions}` maps opaque IDs such as `S1` to user labels and active/expired state. `{events}` contains 2–7 response Set-Cookie updates, requests, server lookups, expiry, or logout deletion.

**Derivation and accepted answers.** Update jar, select Cookie, perform exact server table lookup, and apply declared server action. Authentication label follows only an active matching session entry; authorization is separately printed if used.

**Constraints and rejection.** No password entry, token guessing, signing/encryption, fixation, or security recommendation. One session cookie name and deterministic server action at early levels.

**Variations and difficulty.** L1 login then request; L2 expiry/logout; L3 two paths or stale server session; L4 redirect/origin/credentials-mode interaction.

**Misconceptions and distractors.** `cookie_value_is_username`, `cookie_presence_guarantees_active_session`, `logout_only_changes_server`, `httponly_blocks_request`, `cors_failure_means_server_did_not_process`.

**Feedback.** Show jar, outgoing Cookie, server lookup, authenticated identity, action, and new state at every event.

**Examples.**

1. response stores `sid=S1`; server table S1→Ada active; next matching request → Ada session. L1.
2. jar still has S1 but server marks S1 expired → request sends S1, lookup fails, unauthenticated. L2.
3. logout response expires sid and server deletes S1 → later request sends no sid and table has no S1. L3.

**Implementation and validation.** Compose cookie reducer with a simple session-table reducer. Provenance invariants require every authenticated result to cite an outgoing cookie and active table row.

**Coverage.** Balance active/missing/expired, client/server deletion, scope omission, HttpOnly, redirects, and CORS exposure distinction.

### Cross-family progression

Jar updates precede request selection. Minimal scope comparisons diagnose one predicate at a time. Session traces follow only after storage and selection are mastered; they continue to treat cookie values as opaque.

## 8. Category: Origins and controlled CORS

### Category purpose

Train exact origin comparison and browser response-exposure decisions for a bounded Fetch/CORS profile.

### Learn

An origin is scheme, host, and effective port. Paths do not affect it. Same-site is a separate fixture property used by cookies.

For cross-origin scripted requests, CORS determines whether the browser exposes the response to the script. Some requests can be sent directly and then checked; others need a preflight. A failed check does not mean the server never received the request.

### Prerequisites

URL components, request/response anatomy, field roles, and cookie credentials mode.

### Category boundaries

No CSRF/security exploitation, CSP, CORP/COEP, canvas tainting, opaque origins, public-suffix computation, Private Network Access, redirects during preflight, or live browser testing.

### Subcategories

1. Origin tuples
2. Safelisted requests
3. CORS response checks
4. Preflight policy

### Family `same_origin_decision`

**Skill and mental operation.** Derive origins from two URLs and decide whether they are same-origin.

**Response and template.** Two origin tuples plus yes/no. `Compare {url_a} and {url_b}: derive each origin and decide same-origin.`

**Generated data.** URLs use HTTP(S), ASCII `.test` hosts, default/explicit ports, arbitrary paths/query/fragments.

**Derivation and accepted answers.** Normalize scheme/host and effective port; compare all three tuple elements. Ignore path/query/fragment.

**Constraints and rejection.** Exactly one intended differing component in L1/L2 minimal pairs; L3 may combine differences. No document.domain, opaque origin, IDNA, or inherited origin.

**Variations and difficulty.** L1 path difference same; L2 scheme/host/port difference; L3 explicit default port equivalence/subdomain; L4 construct a same-origin URL satisfying target path.

**Misconceptions and distractors.** `same_host_is_enough`, `path_part_of_origin`, `explicit_default_port_differs`, `subdomain_same_origin`, `same_site_same_origin`.

**Feedback.** Compare a three-column tuple and highlight the first difference.

**Examples.**

1. `https://app.test/a` and `https://app.test/b?q=1` → same origin. L1.
2. `http://app.test` and `https://app.test` → different scheme, not same-origin. L2.
3. `https://app.test` and `https://app.test:443/x` → same effective port, same-origin. L3.

**Implementation and validation.** Reuse the restricted URL parser and origin tuple equality. Exhaust scheme/host/default/nondefault port minimal pairs.

**Coverage.** Balance same/different and each tuple component; include path/query/fragment distractors and explicit defaults.

### Family `cors_request_classification`

**Skill and mental operation.** Decide whether a cross-origin scripted request is safelisted or requires preflight under the pinned subset.

**Response and template.** Classification plus triggering reason set. `Classify cross-origin request {request}: direct CORS request or preflight required?`

**Generated data.** `{request}` contains method, field-name/value safety labels, optional Content-Type, credentials mode, and origin. Non-safelisted cases have 1–3 triggers.

**Derivation and accepted answers.** Check method, each field, and Content-Type value against the profile. Same-origin variants answer “CORS classification not needed.”

**Constraints and rejection.** The fixture prints value-safety facts where Fetch byte restrictions would otherwise require memorization. No upload progress listeners, ReadableStream, or browser-version variations.

**Variations and difficulty.** L1 GET/no custom fields; L2 POST safe versus JSON; L3 custom header/method; L4 multiple triggers or same-origin contrast.

**Misconceptions and distractors.** `all_post_preflight`, `get_never_preflight`, `credentials_cause_preflight`, `response_content_type_controls`, `same_origin_preflight`.

**Feedback.** Show method, field, and content-type gates independently; credentials are handled later.

**Examples.**

1. cross-origin GET with `Accept: application/json` labeled safelisted → direct request, no preflight. L1.
2. cross-origin POST with `Content-Type: application/json` → preflight required because JSON Content-Type is not safelisted. L2.
3. cross-origin PUT with `X-Mode: fast` → preflight required for method and field. L3.

**Implementation and validation.** Use an explicit safelist predicate registry. Exhaust method/content-type/field combinations and ensure trigger sets are complete.

**Coverage.** Balance direct/preflight, methods, all safelisted content types, JSON/custom fields, credentials modes, and same-origin.

### Family `cors_response_exposure`

**Skill and mental operation.** Determine whether a synthetic script may read a cross-origin response and separately whether the server received/processed the request.

**Response and template.** Two controlled fields: server receipt and script exposure. `Script origin {origin} makes {request} and receives network result {response}. Can the script read it? What server receipt is evidenced?`

**Generated data.** `{response}` supplies ACAO, optional ACAC, HTTP status/body, and a simulator observation that the server did/did not receive the request. Credentials mode is explicit.

**Derivation and accepted answers.** Same-origin bypasses CORS gate. Cross-origin compares ACAO; noncredentialed allows exact or `*`; credentialed requires exact plus ACAC true. Receipt follows the synthetic observation, not exposure.

**Constraints and rejection.** No preflight failure in this family unless preflight result is already supplied. ACAO is single-valued. Network failure and CORS failure are distinct choices.

**Variations and difficulty.** L1 wildcard noncredentialed; L2 exact/mismatch; L3 credentialed wildcard/ACAC; L4 HTTP error response that passes/fails CORS while server action occurred.

**Misconceptions and distractors.** `cors_blocks_sending`, `wildcard_with_credentials`, `http_error_always_unreadable`, `acao_is-request-origin`, `acac_sends_cookies`.

**Feedback.** Two lanes: request/server observation, then browser exposure gate. State that ACAC permits credentialed exposure; it does not itself choose credentials mode.

**Examples.**

1. origin `https://app.test`, noncredentialed, ACAO `*` → script may read. L1.
2. credentialed request, ACAO `*`, ACAC true → script cannot read because wildcard is invalid for credentialed exposure. L3.
3. server records POST and returns `403` with exact ACAO → script may read the 403; CORS does not convert it to success. L3.

**Implementation and validation.** A small CORS exposure truth table is independent of the server-event reducer. Exhaust origin exact/wildcard/mismatch × credentials × ACAC × status.

**Coverage.** Balance exposed/blocked, receipt/no receipt, credentials, all ACAO forms, success/error statuses, and same-origin.

### Family `cors_preflight_decision`

**Skill and mental operation.** Evaluate an OPTIONS preflight response against the requested origin, method, field names, and credentials mode.

**Response and template.** Per-check pass/fail and final send/deny. `Preflight request is {preflight}; response policy is {allow_fields}. May the actual request be sent?`

**Generated data.** `{preflight}` contains Origin, requested method, normalized requested-header set, and credentials mode. `{allow_fields}` contains ACAO, ACAM set, ACAH set, and optional ACAC.

**Derivation and accepted answers.** Apply origin/credential rule, require method membership, require every requested non-safelisted field name in allow-header set, and require ACAC for credentialed profile. Send actual request only if all pass.

**Constraints and rejection.** Case-insensitive method/field-name comparison as declared. No wildcard method/header semantics, caching of preflight, redirects, or status quirks; successful fixture status is explicitly supplied.

**Variations and difficulty.** L1 method only; L2 custom field; L3 credentials/origin; L4 multiple fields and first failed predicate.

**Misconceptions and distractors.** `one_allowed_header_enough`, `allow_header_values_not_names`, `allow_methods_uses-original-method`, `acao_wildcard_credentials`, `preflight-success-exposes-actual-response`.

**Feedback.** Checklist origin, credentials, method, and each field. Clarify that a successful preflight permits sending; the actual response still needs its CORS check.

**Examples.**

1. request PUT, response allows origin exactly and methods GET,PUT → method passes; no custom fields → send. L1.
2. requested headers `Content-Type,X-Mode`; allow headers only `Content-Type` → deny actual request because X-Mode missing. L2.
3. credentialed request with exact ACAO and ACAC true, method/header sets pass → send actual request; exposure is not yet decided. L3.

**Implementation and validation.** Set-membership oracle with per-predicate trace. Property-test permutation/case invariance for token sets.

**Coverage.** Distribute failure among origin, credentials, method, first/later header, plus all-pass; vary empty/multiple header sets.

### Family `cors_full_exchange`

**Skill and mental operation.** Trace a complete same-origin/direct/preflighted synthetic fetch through cookie selection, server receipt, response, and exposure.

**Response and template.** Ordered stage table. `Browser context {context} performs fetch {fetch} against policy/server table {tables}. Complete the exchange.`

**Generated data.** `{context}` supplies origin/site/cookie jar; `{fetch}` supplies URL, method, fields, credentials mode; `{tables}` supplies preflight policy, route outcome, CORS response fields, and optional Set-Cookie. In the pinned synthetic fetch profile, an actual response may update cookies when its credentials mode permits credential processing, independently of whether CORS later exposes the response to script.

**Derivation and accepted answers.** Compare origin; classify request; if needed evaluate preflight; select credentials/cookies for actual request; run server only if sent; apply Set-Cookie if response is processed by browser under fixture rules; evaluate script exposure.

**Constraints and rejection.** At most 8 stages and one cause of failure at L1–L3. No redirects, preflight cache, no-cors mode, third-party-cookie blocking policy, or actual networking. Set-Cookie processing follows the displayed credentials mode and pinned cookie rules; script readability is not its gate.

**Variations and difficulty.** L1 same-origin; L2 direct cross-origin; L3 preflight pass/fail; L4 credentialed cookies and response not exposed after server mutation.

**Misconceptions and distractors.** Compose prior CORS/cookie errors, especially `failed_exposure_undoes_server`, `preflight_contains_actual_body`, and `cookies_depend_on_acao`.

**Feedback.** Use a fixed ladder: origin → preflight need → preflight result → cookie selection → server event → response → CORS exposure → visible result.

**Examples.**

1. same-origin GET → no CORS gate; server 200 is readable. L1.
2. cross-origin PUT fails preflight method allow-list → actual request not sent; server route untouched. L3.
3. cross-origin credentialed POST is sent after successful preflight, server increments counter, actual response lacks ACAC → script cannot read response, but counter remains incremented. L4.

**Implementation and validation.** Compose independently tested origin, request-classification, preflight, cookie, route, and exposure reducers. Provenance checks prohibit server events when actual request is denied and prohibit exposure without a response.

**Coverage.** Balance same/direct/preflight, pass/fail stages, credential modes, cookies, success/error statuses, server mutation, and readable/blocked outcomes.

### Cross-family progression

Origin tuples precede request classification; response exposure and preflight are initially separate. Full exchanges are delayed until the learner can distinguish request sending, server processing, and response exposure.

## 9. Category: Intermediaries and synthetic exchange diagnosis

### Category purpose

Train bounded reasoning across browser cache, shared proxy/CDN, and origin without importing packet-level behavior or vendor folklore.

### Learn

An intermediary applies an explicit key and policy. `Vary` can add selected request-field values to a cache key. A shared cache may answer without contacting the origin, validate a stale entry, or forward and store a response. `Age` reports cache age information, not total resource age.

Diagnosis begins with observations. The correct answer is the first rule/state inconsistent with the generated model, or “insufficient evidence” when several causes remain possible.

### Prerequisites

Redirects, negotiation, caching, cookies, origins, and CORS as required by the chosen family.

### Category boundaries

No real proxy configuration, CDN product semantics, load balancing, DNS steering, TLS termination details, packet captures, cache poisoning, request smuggling, origin attacks, or broad production incident response.

### Subcategories

1. Cache keys and Vary
2. Proxy/CDN traces
3. Browser/server diagnosis

### Family `intermediary_cache_key`

**Skill and mental operation.** Construct and compare cache keys under an explicit shared-cache key policy and stored response `Vary`.

**Response and template.** Key fields plus same/different decision. `Cache key policy is {policy}; stored response has Vary {vary}. Compare requests {request_a} and {request_b}.`

**Generated data.** `{policy}` includes scheme, host, effective port, path, query as written, and declared normalization; `{vary}` is empty or a subset of `Accept`, `Accept-Language` (opaque values only), and one synthetic request field. Requests differ in 1–3 dimensions.

**Derivation and accepted answers.** Canonicalize only policy-declared URL parts, then append normalized values of Vary-named fields. Missing field has an explicit empty marker distinct from arbitrary values.

**Constraints and rejection.** No implicit query sorting, tracking-parameter removal, method-body keys, Vary `*`, or CDN defaults. One deterministic comparison. Reject differences ignored by policy unless that is the intended misconception contrast.

**Variations and difficulty.** L1 path/query; L2 Vary Accept; L3 explicit-default port/normalization; L4 three requests grouped into key equivalence classes.

**Misconceptions and distractors.** `ignore_query`, `sort_query_unasked`, `vary_is-response-field-value`, `all_headers_in_key`, `host_only_key`.

**Feedback.** Serialize key components in order for each request and highlight first difference.

**Examples.**

1. default key, `/item?id=1` versus `/item?id=2` → different query, different keys. L1.
2. same URL, Vary Accept, JSON versus HTML Accept values → different keys. L2.
3. `https://cdn.test/x` versus `https://cdn.test:443/x` → same effective-port key under displayed canonicalization. L3.

**Implementation and validation.** Typed key serializer and equality oracle; permutation tests for field-table display; round-trip stable fingerprints.

**Coverage.** Balance same/different, every key component, absent Vary values, default ports, and policy-declared normalization.

### Family `proxy_cdn_cache_trace`

**Skill and mental operation.** Execute a bounded client → private cache → shared cache/CDN → origin trace and identify response/body/age provenance.

**Response and template.** Ordered hop decisions and final states. `Process request timeline {timeline} through layers {layers} using policies {policies}.`

**Generated data.** `{layers}` contains one or two caches plus origin. `{policies}` prints lookup order, key, storage kind, age forwarding, and origin versions. `{timeline}` has 1–6 sequential requests.

**Derivation and accepted answers.** At each request, consult private then shared layer as printed; compute key/freshness; serve, validate upstream, or forward; update Age/metadata and permitted cache states; record which layer supplied body.

**Constraints and rejection.** No concurrency, shield tiers beyond two caches, collapsed requests, stale extensions, eviction, purge, vendor `X-Cache` semantics, or hidden normalization. All clocks share the exercise timeline.

**Variations and difficulty.** L1 one shared miss/hit; L2 private over shared; L3 shared validation with origin; L4 negotiated Vary variant and different ages at layers.

**Misconceptions and distractors.** `origin_contact_on_every_request`, `age_resource_birth`, `private_directive_stored_shared`, `shared_hit_refreshes_origin_date`, `client_age_equals-stored-age-header-only`.

**Feedback.** Render one row per layer with key, stored metadata, current age, decision, upstream call, body provenance, and new entry.

**Examples.**

1. empty CDN gets GET; origin returns A max-age100; t20 second client request → CDN fresh hit A, origin not contacted. L1.
2. browser private cache stale but CDN copy fresh → browser validates/requests upstream per printed policy; CDN supplies A without origin. L2.
3. CDN has stale A ETag `"a"`; origin returns304 with max-age60 → CDN keeps A, updates metadata, sends reusable A downstream. L3.

**Implementation and validation.** Compose cache reducers with explicit upstream response generation. Body provenance IDs and event-count conservation must match an independent replay.

**Coverage.** Balance layer supplying response, cold/fresh/stale, 200/304, private/shared storage, Age branches, and Vary.

### Family `synthetic_exchange_reconstruct`

**Skill and mental operation.** Put shuffled browser/cache/server observations into the only valid causal order and fill missing state transitions.

**Response and template.** Ordered sequence plus missing labels. `Reconstruct the exchange from observations {observations} under policy {policy}.`

**Generated data.** `{observations}` has 4–10 labeled facts from URL resolution, request, redirect, cache lookup, conditional request, Set-Cookie, CORS preflight/actual request, server response, and script exposure. `{policy}` supplies all necessary semantics.

**Derivation and accepted answers.** Build dependency edges from typed event provenance, topologically order the asked subset, and run state transitions to fill missing labels.

**Constraints and rejection.** Generator requires a unique order for asked events; unrelated concurrent events are excluded. No inference from timestamps alone when ties exist; stable indexes are shown if needed.

**Variations and difficulty.** L1 request/response; L2 cache validation; L3 redirect/cookie; L4 preflight/server/exposure with an intermediary.

**Misconceptions and distractors.** `304_before_conditional`, `cookie_sent_before_set`, `actual_before_preflight`, `exposure_before-response`, `redirect-location-resolved-against-start`.

**Feedback.** Show causal arrows and state snapshots; identify the first violated prerequisite in an incorrect ordering.

**Examples.**

1. request → server `200` with Set-Cookie → jar update → later Cookie request. L1.
2. stale lookup → conditional GET → origin304 → merge → serve stored body. L2.
3. preflight OPTIONS → allow response → actual PUT → server204 → exposure check. L3.

**Implementation and validation.** Generate forward from an event DAG, shuffle, and require unique topological order for the graded subset. Replay must reproduce every observation.

**Coverage.** Balance mechanism combinations, missing event position, forward/inverse reconstruction, and all causal misconception edges.

### Family `synthetic_exchange_diagnosis`

**Skill and mental operation.** Identify the first inconsistent stage or the strongest conclusion supported by a bounded exchange.

**Response and template.** Single controlled diagnosis plus evidence labels. `Expected model/policy is {expected}. Observed exchange is {observations}. Choose the first contradiction or “insufficient evidence.”`

**Generated data.** `{expected}` is a typed policy table. `{observations}` is generated from a valid trace, then optionally mutated by exactly one named fault: wrong URL target, method rewrite, negotiation result, cache key/age, validator status, cookie inclusion, preflight decision, status, or exposure claim.

**Derivation and accepted answers.** Replay expected state in order and compare observations; choose earliest mismatching transition. In underdetermined variants, intersect all fault hypotheses consistent with evidence and answer only their shared conclusion or insufficient evidence.

**Constraints and rejection.** One contradiction in determinate items. No hidden server internals, timing races, real-browser quirks, or open prose. Reject mutations masked by an earlier failure or producing multiple equally early mismatches.

**Variations and difficulty.** L1 one message inconsistency; L2 cache/cookie state; L3 CORS server-versus-exposure; L4 partial observations with competing hypotheses.

**Misconceptions and distractors.** Each simulator's wrong transforms plus `blame_lower_layer_after-http-response`, `cors-block-means-server-not-reached`, and `cache-hit-proves-origin-current`.

**Feedback.** Separate `observed`, `deduced`, and `not known`; show the expected transition only through the first divergence.

**Examples.**

1. current URL has fragment `#top`, observed request target `/x#top` → first contradiction: fragment included in request target. L1.
2. cache age equals lifetime but trace labels fresh hit → first contradiction: equality is stale. L2.
3. server log records POST and client reports unreadable CORS response → deduce server received it; cannot deduce script saw body. If asked why exposure failed without fields, answer insufficient evidence. L4.

**Implementation and validation.** Fault injection starts from valid traces. An independent replay/diff oracle verifies unique earliest divergence; hypothesis-set fixtures verify every “insufficient evidence” answer.

**Coverage.** Distribute first failure across all topic mechanisms, positive valid traces, evidence insufficiency, and success/error statuses. No single “CORS” or “cache” diagnosis may dominate.

### Cross-family progression

Cache keys precede multi-layer traces. Reconstruction trains causal order before diagnosis removes or corrupts evidence. Integrated diagnosis should draw only from mastered families and introduce no more than one new mechanism.

## 10. Topic-wide progression

Recommended introduction order:

1. URL components and request targets;
2. percent encoding as a byte transform inside an already identified component;
3. request and response anatomy;
4. method properties and method selection;
5. status interpretation and status selection;
6. field roles and media-type metadata;
7. direct Accept negotiation and response metadata;
8. redirect reference resolution, then one-hop and chain transitions;
9. cache storage and freshness lifetime;
10. current age, reuse decisions, validators, conditional statuses, and `304` merge;
11. single-cache then multi-cache timelines;
12. cookie-jar updates, request selection, and session traces;
13. origins, CORS request classification, response exposure, and preflight;
14. full CORS exchanges;
15. intermediary keys/traces, reconstruction, and diagnosis.

After direct mastery, deliberately interleave these contrast pairs:

- written port versus effective port;
- encoded delimiter versus structural delimiter;
- URL fragment versus request target;
- `Accept` versus `Content-Type`;
- safe versus idempotent;
- idempotent effect versus identical response;
- `200` versus `201`/`202`/`204`;
- `400` versus `415` versus `422`;
- `401` versus `403`;
- `404` versus `405`;
- `409` versus `412`;
- `500` versus `502`/`503`/`504`;
- `302`/`303` rewrite versus `307`/`308` preservation;
- store permission versus direct reuse;
- freshness lifetime versus current age;
- `no-cache` versus `no-store`;
- private versus shared cache;
- `304` response body versus stored body;
- strong versus weak ETag comparison;
- host-only versus Domain cookie;
- HttpOnly script visibility versus HTTP sending;
- origin versus site key;
- CORS request sending versus response exposure;
- successful preflight versus successful actual-response exposure;
- browser cache hit versus origin contact.

Combined traces must reuse mastered primitives. When a learner fails a combined item, the app should present a shorter diagnostic family targeting the first divergence rather than simply reducing every number or removing useful state.

## 11. Adaptive practice guidance

### Mastery dimensions

Track mastery by:

- category, subcategory, and stable family ID;
- URL component/reference form and encoding byte class;
- method and property axis;
- status and named contrast pair;
- field role and media-type shape;
- negotiation match type, q boundary, and tie-break stage;
- redirect status, URL form, origin change, and method/body outcome;
- cache kind, directive, lifetime source, age formula branch, reuse result, validator kind, and timeline transition;
- cookie attribute, selection predicate, same-site context, and jar transition;
- origin tuple component, CORS preflight trigger/failure stage, credentials mode, and exposure result;
- intermediary layer/body provenance and diagnostic fault stage;
- misconception transform and response mode;
- difficulty dimension, not merely L1–L4 aggregate.

Accuracy, hint use, retry count, and response time may update mastery, but response time must not turn the app into a speed test. A slow correct answer with a sound worked trace should schedule spaced review, not immediate demotion.

### Failure routing

| Error pattern | Targeted next practice |
|---|---|
| fragment included in target | minimal URL target/fragment pair |
| `%2F` split into path segments | parse-before-decode percent contrast |
| space encoded as `+` | URL percent versus form-encoding note and transform |
| Accept/Content-Type reversed | paired request/response anatomy |
| DELETE called non-idempotent because second status changes | effect-versus-response method example |
| every successful creation answered 200 | `200/201/202/204` outcome set |
| JSON semantic error answered 400 or 415 | `400/415/422` contrast |
| first Accept range chosen | per-representation negotiation score table |
| specific `q=0` ignored due wildcard | exact-exclusion negotiation pair |
| all redirects changed to GET | `303` versus `307` minimal pair |
| Location resolved against original URL in a chain | two-hop base-update trace |
| no-cache treated as no-store | storage-versus-reuse pair |
| Age treated as resource creation age | current-age formula and evidence limitation |
| age equal to lifetime called fresh | exact-boundary freshness pair |
| weak ETag used for If-Match | strong/weak validator minimal pair |
| 304 treated as empty client content | stored-body merge trace |
| HttpOnly cookie omitted from HTTP | script-read versus request-send comparison |
| host-only cookie sent to subdomain | host-only/Domain scope pair |
| same-site equated with same-origin | supplied site-key/origin tuple comparison |
| all POST requests assumed preflighted | safelisted text POST versus JSON POST |
| wildcard accepted with credentials | ACAO/ACAC truth-table pair |
| CORS failure said server was unreachable | server receipt versus script exposure trace |
| Vary ignored | side-by-side cache key serialization |
| cache hit said origin is current | evidence-bounded intermediary diagnosis |
| diagnosis jumps to later visible symptom | replay only to earliest divergent transition |

### Selection mix

After prerequisites, a default adaptive session should target:

- 35% weakest misconception/dimension;
- 25% spaced review of previously mastered families;
- 20% contrast pairs;
- 10% inverse/construction questions;
- 10% bounded combined traces.

No combined trace should be selected when either of its two principal prerequisite families is below the learner's configured foundational threshold.

## 12. Feedback, rendering, interaction, and accessibility

### Feedback contract

Correct feedback must name the decisive rule in one or two sentences before optional detail. Incorrect feedback must:

1. normalize and show the learner's answer;
2. identify a matching misconception transform when one exists;
3. show the first divergent step;
4. show the corrected state transition;
5. optionally continue the trace, clearly labeled as worked solution.

Do not dump a full redirect/cache/CORS trace when the only error was an effective default port. Conversely, do not respond only “stale” when age arithmetic or directive precedence was the trained skill.

Worked solutions use exact labels:

- `sent by client`, `received by server`, and `exposed to script`;
- `response message body` and `stored representation body`;
- `freshness lifetime`, `current age`, and `remaining freshness`;
- `host-only`, `domain-match`, `path-match`, and `site context`;
- `origin tuple` and supplied `site_key`;
- `observed`, `deduced`, and `not known`.

### Required views

Reusable renderers must include:

- color-and-label URL component strips;
- UTF-8 byte and percent-triplet rows;
- request/response cards with start metadata, field table, and content panel;
- method-property and status-decision matrices;
- representation/Accept scoring tables;
- redirect hop timelines;
- cache entry cards and age/freshness equations;
- private/shared cache layer diagrams;
- cookie-jar tables and per-cookie predicate checklists;
- origin tuple comparison cards;
- CORS stage ladders;
- browser → cache/proxy/CDN → origin sequence tables;
- observed/deduced/unknown diagnosis panels.

All renderers consume the same typed objects as the oracle. Text, diagram, answer, and worked trace must never be randomized separately.

### Display budgets

- URL: at most 140 visible characters;
- percent transform: at most 24 bytes or 20 input scalar values;
- field table: at most 12 rows;
- representation variants: at most 5;
- redirect chain: at most 5 followed hops;
- cache/cookie entries: at most 8 per table;
- timeline: at most 12 events, normally 8 or fewer;
- policy table: at most 10 predicates.

If responsive wrapping obscures a delimiter or field value, provide a horizontally scrollable code region with a full accessible text equivalent. Never insert a visual line break that appears to be an HTTP delimiter.

### Interaction

- Named fields use separate labeled controls so an embedded space or comma is not an accidental parser problem.
- Ordered timelines support keyboard move controls as well as drag-and-drop.
- Matching tables have a non-drag select-control alternative.
- Multi-choice sets announce selection count and do not rely on color.
- Cache/CORS timelines have step-forward/back controls and a complete static table alternative.
- Correct fields remain visible on retry outside exam mode.
- Hints expose one decision stage, never the final answer by elimination alone.
- Copy/paste is supported for URL, ETag, and percent strings.

### Accessibility and motion

- Semantic HTML tables are the primary representation for policies and state; SVG is supplemental.
- Every arrow diagram has an equivalent ordered list with `from`, `to`, and event labels.
- Colors are paired with icons/text patterns and meet contrast requirements.
- Focus order follows causal order even when responsive layout changes columns.
- Reduced-motion preference disables automatic hop/cache animation; all motion has manual step controls.
- No exercise requires audio, precise pointer movement, or color vision.

## 13. Implementation model

### Delivery

The app must be a standalone HTML document with embedded JavaScript/CSS and no runtime dependencies. It should work when opened directly from local storage under the browser's ordinary restrictions. It must not depend on a local web server, origin-specific browser feature, build service, or backend.

A build pipeline may assemble/minify the file and run tests, but the distributed artifact must contain:

- all templates, Learn text, standards metadata, generators, oracles, and styles;
- no remote URLs used as runtime resources;
- no dynamic code loading;
- a visible app/model version and offline statement.

### Core semantic types

Use explicit structures equivalent to:

```text
Url, UrlReference, Origin, SiteKey, PercentEncodedBytes
HttpRequest, HttpResponse, HeaderField, Representation
MethodProfile, StatusOutcome, RouteOutcome
MediaType, MediaRange, RepresentationVariant
RedirectEvent, RedirectState
CacheControl, CacheKey, CacheEntry, CachePolicy, CacheEvent
EntityTag, HttpDate, ConditionalRequest
Cookie, CookieJar, CookieContext, SessionEntry
CorsRequest, PreflightPolicy, CorsResponsePolicy, FetchEvent
IntermediaryLayer, ExchangeEvent, Observation, Diagnosis
```

Times and q values are integers. q is stored as thousandths. Cookie/session creation ordering uses monotonically increasing integers. Do not compare semantic URLs, origins, media types, field names, or cookies as unparsed display strings.

### Semantic-source rule

Every instance is one immutable semantic object. The implementation must:

- generate semantic components before rendering URL/message text;
- derive request targets and origins from parsed URL components;
- serialize percent bytes from a byte array and parse them back;
- derive choices from the correct answer through named misconception transforms;
- run redirect/cache/cookie/CORS/intermediary events through reducers to obtain all timeline rows and final states;
- assign provenance IDs to every response body, stored body, cookie update, cache entry version, and server mutation;
- store model version, family ID, seed, difficulty dimensions, misconception tags, locale, and structural fingerprint with a saved attempt.

Learner input is parsed only by narrow answer parsers. It is never interpolated into HTML, JavaScript, a URL navigation, a request API, or executable code. Render generated and learner strings with text nodes; do not use unsanitized `innerHTML`.

### Pure deterministic reducers

Implement small reducers rather than a browser emulator:

- controlled URL parser/serializer and relative-reference resolver;
- strict UTF-8 percent encoder/decoder;
- method/status decision tables;
- restricted field/media-range parsers and negotiation scorer;
- redirect transition reducer;
- storage predicate, cache-age/freshness calculator, conditional evaluator, `304` merger, and cache timeline reducer;
- cookie acceptance/jar reducer and request-selection predicate pipeline;
- origin comparator, CORS request classifier, preflight evaluator, and exposure evaluator;
- session table and intermediary layer reducers;
- event-DAG reconstruction and trace-diff diagnosis oracle.

Each reducer accepts explicit state/event/policy and returns immutable new state plus observations and a derivation trace. No reducer reads the clock, location bar, cookies, cache, network, user agent string, or global mutable state.

### Parsing requirements

- URL parser accepts only the pinned grammar and returns structured errors.
- Percent decoder operates on bytes and rejects malformed triplets before UTF-8 decoding.
- Field-name parser validates controlled ASCII token names; field values are dispatched to field-specific parsers.
- `Cache-Control` parser accepts a generated subset and rejects duplicate/conflicting directives unless a family explicitly models their resolution.
- q values parse as exact decimal thousandths in `[0,1000]`.
- ETags preserve quotes, weakness, and opaque bytes exactly.
- Cookie parser accepts only the generated subset and reports one or more typed rejection reasons.
- Answer parsers reject extra unrequested values, malformed URLs/tags/percent triplets, out-of-range ports/q/seconds, and ambiguous list separators.

The implementation may use native `TextEncoder`/`TextDecoder` after feature detection, but tests must pin expected bytes. It must not use native `fetch`, `XMLHttpRequest`, image/script loads, or navigation to “test” an answer.

### Generation and rejection pipeline

For each question:

1. select family and targeted mastery dimensions;
2. construct a useful semantic outcome, often backward from a misconception/boundary;
3. fill compatible state and policy;
4. run the authoritative oracle;
5. apply every family rejection rule;
6. generate distractors from applicable named transforms;
7. normalize answer and choices, rejecting collisions;
8. render prompt/visual/solution;
9. parse rendered machine-readable spans back where applicable;
10. compute structural fingerprint and reject recent duplicates.

Forward random generation should not be used when it overproduces GET/200, fresh hits, empty cookie headers, same-origin requests, wildcard negotiation, or one-hop redirects.

### Structural fingerprints

Fingerprints omit cosmetic names, body text, and exact times where possible. They include:

- family and response mode;
- semantic graph/state shape;
- decisive rule/branch;
- method/status/media-range form;
- redirect status sequence and method-transition pattern;
- cache-kind/directive/age-branch/outcome sequence;
- cookie predicate pass/fail vector;
- origin/CORS stage/failure vector;
- intermediary provenance/fault location;
- targeted misconception.

Recent suppression operates within and across cosmetically related families.

### Distractor registry

Every transform has stable ID, applicability predicate, transformation, and feedback text. At minimum implement all misconception IDs named in the families. The registry must ensure:

- a transform is applied only when its wrong mental model is plausible for that instance;
- output parses under the response mode;
- output differs semantically from the correct answer and other choices;
- no distractor depends on an unmodeled browser/vendor rule;
- selecting it points to the exact first divergent operation.

Arbitrary nearby status numbers, ages, ports, or q values are forbidden unless the numerical boundary itself is the misconception.

### Randomization and reproducibility

- Use a documented seeded PRNG; the same seed, model, family, locale, and difficulty vector reproduces the same semantic instance.
- Saved questions never silently change after standards/profile updates.
- Fixture identifiers remain internally consistent throughout one instance.
- Generator retries have a fixed maximum and emit a development error with rejection statistics rather than falling back to an unvalidated item.
- A debug build can display seed, semantic JSON, derivation trace, transform IDs, and fingerprint; production hides these unless diagnostic mode is enabled.

### Localization

Protocol tokens and standard field names remain unchanged. Translators receive:

- protected spans for URLs, methods, statuses, fields, ETags, media types, cookie pairs, and directives;
- a glossary distinguishing content/representation/resource/message body, cache age/resource age, origin/site, and sent/received/exposed;
- complete sentence templates with grammatical context;
- plural/unit placeholders for seconds, entries, requests, and hops.

Do not construct localized prompts by concatenating English-order fragments. Locale changes may alter prose and date presentation, but never semantic parsing, q arithmetic, URL bytes, or answer identity.

### Optional local persistence

If progress persistence is implemented:

- it is opt-in or clearly disclosed;
- records contain only model/family mastery, attempt summaries, seeds, preferences, and no entered free text beyond normalized answer data needed for review;
- export/import is a versioned JSON record validated before use;
- “clear progress” is explicit and local;
- app function does not depend on storage availability.

## 14. Automated validation

### Per-instance validation

Every generated instance must pass:

- all placeholders substituted and escaped;
- semantic model, prompt, cards/tables/timeline, answer, feedback, and worked trace agree;
- model/profile and source-rule metadata present;
- answer parser accepts the canonical answer and every declared equivalent;
- malformed/out-of-range forms are rejected;
- exactly one single-choice answer or exactly one normalized answer set;
- every distractor is distinct, applicable, and tagged;
- every event reference points to an existing URL, request, response, cache/cookie/session entry, policy, or representation;
- event ordering is deterministic under displayed time/index rules;
- all family constraints/rejection rules and display budgets hold;
- structural fingerprint differs from the active recent set;
- no synthetic name/address/value violates the namespace/safety validators.

### Unit and property tests

Tests must include:

- URL parse/serialize round trips and effective-port/origin equivalence;
- relative-reference resolution fixtures for every supported form and dot-segment boundary;
- UTF-8/percent encode-decode round trips, reserved encoded bytes, malformed triplets, overlong/invalid UTF-8 rejection;
- request-target exclusion of fragment for every URL shape;
- exhaustive core method safety/idempotency matrix and operation-intent mapping;
- every status-decision leaf and named contrast pair;
- field-name case normalization and restricted value parser round trips;
- media type/range parse/serialize and exact q-thousandth ordering;
- negotiation permutation properties except declared list/server tie-breaks;
- redirect transition table for each status/method combination and loop/limit off-by-one cases;
- storage-decision matrix for private/shared and all supported directives;
- freshness precedence, zero/negative Expires delta, and equality-stale boundary;
- current-age formula branch coverage and monotonicity in `now`;
- strong/weak ETag, list, wildcard, date equality, and conditional precedence;
- `304` metadata merge field-by-field and stored-body identity;
- cache timeline replay and body-provenance conservation;
- cookie domain/path/default-path/expiry/replacement rules;
- cookie selection across Secure/HttpOnly/SameSite/credentials and ordering;
- origin equality for every tuple component/default port;
- CORS classification, preflight set membership, credentials/wildcard truth table, and response exposure;
- full-exchange invariant that denied actual requests never generate server events;
- intermediary key equality and multi-layer replay;
- event-DAG unique ordering and diagnosis earliest-divergence/hypothesis sets.

Where practical, implement two differently structured oracles, such as a direct formula and decision-table reducer. Native/local reference APIs or reviewed third-party libraries may be used only in development differential tests and never at runtime.

### Curated boundary corpus

Maintain hand-reviewed fixtures for at least:

- absent path, empty/root path, explicit default/nondefault port, query-only and fragment-only reference;
- `%00`, `%20`, `%25`, `%2F`, `%3F`, `%23`, mixed hex case, and 2/3/4-byte UTF-8;
- every method property pair and every bounded status;
- q `0`, `0.001`, equal q, `0.999`, and `1`;
- every redirect status, cross-origin hop, loop, and exact follow limit;
- `max-age=0`, `s-maxage` precedence, Expires=Date, Age/lifetime equality, apparent/corrected-age branch tie;
- weak-versus-strong equal opaque tags, validator lists, `*`, and conditional precedence;
- cookie domain label boundaries, path boundary, Secure over HTTP, SameSite Lax top-level GET versus POST, expiry at exactly now;
- origin default ports, subdomains, scheme changes, and path-only differences;
- CORS exact/wildcard/mismatch with and without credentials, empty/multiple requested-header sets;
- Vary absent/present/missing request field and identical/different cache keys;
- underdetermined diagnosis with at least two surviving hypotheses.

### Fuzz targets

Before release, run at least:

- 100,000 URL/reference/percent instances;
- 25,000 method/status decision instances;
- 50,000 media negotiation instances;
- 25,000 redirect transitions and 10,000 redirect chains;
- 100,000 cache age/freshness/conditional instances;
- 25,000 cache timelines and 10,000 two-layer intermediary traces;
- 50,000 cookie updates/selections and 10,000 session traces;
- 50,000 origin/CORS primitive decisions and 20,000 full exchanges;
- 20,000 event reconstructions and fault-injected diagnoses;
- at least 10,000 seeds per family/level for ambiguity, degeneration, distractor collision, structural duplication, and rendering overflow.

If exhaustive enumeration covers a finite matrix more strongly than a numeric fuzz target, document the matrix and equivalent coverage. Lowering a target requires reviewed evidence of equivalent testing.

### Standards/profile conformance fixtures

Each externally derived rule stores:

- topic model and patch version;
- source document/snapshot identifier and section/algorithm anchor;
- a short explanation of any teaching-profile narrowing;
- reviewed input/output fixtures;
- date and result of the last source review.

A changed living standard or erratum does not mutate existing questions. It triggers source review, a new model/patch ID, fixture regeneration, saved-question migration decision, and visible changelog.

### Content audit

Large seeded runs must verify:

- no family/category or trivial GET/200 pattern dominates;
- safe/unsafe, idempotent/non-idempotent, positive/negative, same/cross-origin, fresh/stale, and exposed/blocked outcomes meet coverage targets;
- boundary values recur but do not dominate;
- every misconception transform is exercised;
- combined questions introduce at most one unmastered mechanism;
- no prompt exceeds display budgets;
- no real routable hostname, credential-like token, security bypass string, or network API invocation appears;
- explanations never conflate CORS with server reachability, HTTP cache with DNS cache, `304` with redirect, or HttpOnly with request omission.

## 15. Coverage requirements

### Default mixed-practice proportions

After prerequisites, long-run selection should target:

| Area | Target share |
|---|---:|
| URLs, percent encoding, and anatomy | 14% |
| Methods and statuses | 15% |
| Fields, media types, and negotiation | 12% |
| Redirects | 10% |
| Caching and validators | 24% |
| Cookies and sessions | 12% |
| Origins and CORS | 9% |
| Intermediaries and diagnosis | 4% |

Adaptive review may override these totals for a learner. Within categories:

- percent-encoding practice must include non-ASCII in at least one quarter of mature-level instances;
- GET must remain below half of mature method questions;
- no bounded status may disappear from long-run practice, but contrast utility should weight selection;
- at least one third of negotiation instances must contain wildcard/specific precedence and at least one fifth a q=0 exclusion or `406`;
- redirect statuses must be distributed so `307/308` preservation is not a rare footnote;
- private/shared caches should approach 55/45 after introduction;
- at least one quarter of cache decisions should occur at exact or one-second freshness boundaries;
- validator practice should keep ETag/date near 70/30 while including all precedence cases;
- cookie selection should make every predicate the decisive exclusion regularly;
- same-origin and cross-origin should be near balanced in origin comparison, while CORS families naturally focus cross-origin;
- CORS failures must distribute across request classification, preflight origin/method/header/credentials, and actual-response exposure;
- at least one third of advanced diagnosis should include an evidence limitation or `insufficient evidence`;
- integrated traces should remain at or below 15% of a general session until all contributing foundations are mastered.

Structural recent-history suppression must prevent a new item from differing only in host, path, body word, status reason phrase, cookie token, or numeric time offset.

## 16. Stable navigation and implementation priorities

### Learner-facing navigation

Expose these stable groups:

1. URLs & Encoding
2. Requests & Responses
3. Methods & Statuses
4. Headers & Media Types
5. Content Negotiation
6. Redirects
7. Caching & Validators
8. Cookies & Sessions
9. Origins & CORS
10. Proxies, CDNs & Diagnosis

Stable family identifiers are the backticked IDs in this document. Navigation labels may be localized, but IDs and saved mastery dimensions must remain stable within the model major version.

### Recommended v1 implementation slice

A coherent first release should implement:

- URL components, percent encoding, and message anatomy;
- method properties/selection and bounded status interpretation/selection;
- field roles, media types, and Accept negotiation;
- Location resolution, redirect transitions, and short chains;
- private/shared cache storage, lifetime/age/freshness, ETag/Last-Modified conditions, `304` merge, and one-cache timelines;
- Set-Cookie update, request selection, and short session traces;
- origin comparison, request classification, preflight, response exposure, and simple full exchanges;
- cache keys, one shared intermediary, reconstruction, and one-fault diagnosis.

Two-cache layered traces, inverse construction variants, advanced conditional precedence, and combined redirect-cookie-CORS diagnosis may ship in a second increment. Their types should still be reserved so early saved data does not require ad hoc migration.

### Low-value or unsuitable dynamic content

Do not build question families for:

- memorizing all methods, statuses, header names, media types, or cookie attributes without a decision;
- reciting RFC sentences or reason phrases;
- guessing browser/vendor behavior not in a printed profile;
- parsing arbitrary live devtools/HAR/capture exports;
- identifying MIME type solely from filename extension;
- open-ended API design or production cache-policy advice;
- security exploit construction, bypass attempts, or “make CORS allow everything” configuration;
- real network debugging or server administration.

Use concise Learn/reference cards for vocabulary that does not support repeated deterministic reasoning.

## 17. Standards and reference profile

`http-web-v1` is a pinned teaching subset. Source metadata should reference the exact applicable sections/algorithms from:

- RFC 3986 for the controlled URI-reference resolution subset;
- the WHATWG URL Standard snapshot selected for web-facing terminology, with differences from the restricted parser documented;
- RFC 9110 for HTTP semantics, methods, statuses, fields, validators, and conditional request precedence;
- RFC 9111 for HTTP caching, age, freshness, storage, and validation;
- RFC 9112 only for terminology shared with HTTP/1.1; byte framing remains out of scope here;
- RFC 6265 and the explicitly reviewed cookie-profile updates used by the implementation;
- the dated Fetch Standard snapshot identified by `fetch-cors-profile-2026-07-30` for the controlled CORS subset;
- the IANA media-type registry only for names used in curated fixtures, never as a runtime dependency.

The source code must record a precise snapshot/section per rule rather than relying only on this bibliography. If a teaching rule deliberately narrows implementation diversity—especially `301/302` rewriting, SameSite site calculation, CORS safelisting, or cookie updates—that narrowing must be labeled in Learn material and fixture metadata.

## 18. Topic-level quality checklist

Before accepting an implementation:

- [ ] The artifact is one offline HTML/JavaScript/CSS file with no backend, runtime network access, remote asset, or browser automation.
- [ ] Every displayed request, response, cache, cookie, session, policy, and timeline is synthetic and derived from one semantic instance.
- [ ] Admin Practice retains endpoint/routing/listener/operational exercises; this topic owns web semantics and browser policy.
- [ ] Networking and Protocols retains byte framing, connections, TLS/QUIC, packets, and lower layers.
- [ ] URL structure is identified before percent-decoding.
- [ ] Fragments never enter generated HTTP request targets.
- [ ] Percent encoding uses UTF-8 bytes and never silently treats `+` as space.
- [ ] Safety and idempotency remain distinct, and idempotency never promises identical responses.
- [ ] Method/status selection scenarios have one answer under a printed contract.
- [ ] Request `Accept` and representation `Content-Type` are never reversed.
- [ ] Every negotiated selection follows exact q/specificity/server-order rules and cacheable variants use correct Vary metadata.
- [ ] Redirect method/body rules follow the pinned profile and every new URL recomputes target/origin-sensitive state.
- [ ] `304` is treated as validation, never navigation.
- [ ] Cache storage, freshness, and reuse are distinct decisions.
- [ ] Freshness uses `current_age < lifetime`; equality is stale.
- [ ] `no-cache` and `no-store`, private and shared, and Age and resource age remain distinct.
- [ ] Strong/weak validator comparisons and precondition precedence are exact.
- [ ] A `304` carries no new body and merges only declared metadata into the stored entry.
- [ ] Cookie tuples, replacement, expiry, Domain/host-only, Path, Secure, HttpOnly, SameSite, and ordering follow the profile.
- [ ] Cookies and session IDs are opaque and are not presented as authorization proof.
- [ ] Origin uses scheme/host/effective-port; supplied site key is not conflated with origin.
- [ ] CORS distinguishes preflight need, actual request sending, server processing, and response exposure.
- [ ] Credentialed CORS never accepts wildcard ACAO.
- [ ] Intermediary behavior is controlled by printed key/policy, not vendor folklore.
- [ ] Diagnosis distinguishes observed, deduced, and unknown and selects the earliest contradiction.
- [ ] Every family has stable ID, task, response/template, generated data, exact derivation, accepted-answer rule, constraints/rejections, variations/difficulty, misconception distractors, feedback, three examples, implementation/validation, and coverage.
- [ ] Every distractor comes from an applicable named misconception and normalizes distinctly.
- [ ] Difficulty rises through reasoning/state composition, not dump length or obscure trivia.
- [ ] Automated tests cover boundaries, round trips, state transitions, differential oracles, large seed samples, and rendering budgets.
- [ ] Every external rule has pinned source metadata and an update/migration path.
- [ ] Repeated practice improves HTTP/web-protocol reasoning rather than static vocabulary recall.
