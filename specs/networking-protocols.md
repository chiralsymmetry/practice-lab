# Networking and Protocols — Dynamic Practice Specification

Status: implementation specification

Audience: exercise-generator, packet-simulator, answer-parser, renderer, and validation implementers

## 1. Topic overview

### Topic name

Networking and Protocols

### Topic goal

Develop the ability to read network structures, mentally execute bounded protocol exchanges, and explain what each device or endpoint will do next.

The learner should become fluent at moving between bytes, headers, tables, and packet timelines. The emphasis is not vendor-command recall. It is transferable reasoning: identify the next hop, resolve its link-layer address, follow encapsulation, update the fields that change, interpret acknowledgements, and locate the first layer at which observed behavior becomes inconsistent.

### Relationship to Admin Practice

This is an independent app, not an advanced mode inside Admin Practice.

Admin Practice retains concise operational exercises involving IPv4 CIDR, longest-prefix routing, DNS chains, listening sockets, URLs, and service-layer troubleshooting. This app may briefly review those ideas, but uses them as inputs to deeper packet and state reasoning:

- Ethernet II frames, switching, MAC learning, and VLANs;
- ARP and IPv6 Neighbor Discovery;
- IPv4 and IPv6 headers, forwarding, fragmentation, and extension headers;
- ICMP, path MTU, and traceroute;
- UDP and TCP segments, sequence space, retransmission, flow control, and teardown;
- DNS and DHCP exchanges rather than only final lookup results;
- HTTP framing, TLS roles, and QUIC architecture;
- NAT/PAT, access rules, and stateful firewalls;
- synthetic packet captures and end-to-end fault isolation.

Mastery in one app must not be required to launch the other. Any shared family uses the same underlying convention and may share generator code, but its Learn material and prerequisites are present locally.

### Scope

The initial protocol model ID is `network-protocols-v1`. It covers:

- binary and hexadecimal packet fields in network byte order;
- Ethernet II unicast, multicast, broadcast, padding, FCS accounting, and selected EtherTypes;
- one optional IEEE 802.1Q tag, access ports, tagged trunks, VLAN membership, and per-VLAN forwarding databases;
- learning-bridge forwarding without loops;
- IPv4 ARP request/reply and cache behavior;
- IPv6 Neighbor Solicitation, Neighbor Advertisement, solicited-node multicast, router discovery, duplicate-address detection, and bounded SLAAC;
- IPv4 addressing, headers, TTL, header checksum, forwarding, and fragmentation;
- IPv6 addressing, the fixed base header, hop limit, next-header chains, and source-only fragmentation;
- connected, static, and default routes selected by longest prefix;
- ICMPv4/ICMPv6 echo, unreachable/error messages, time exceeded, and Packet Too Big behavior;
- link MTU, path MTU, TCP MSS, encapsulation overhead, and tunnel budgets;
- UDP headers, lengths, checksums at the rule-recognition level, and demultiplexing;
- TCP connection identity, three-way handshake, sequence/acknowledgement arithmetic, cumulative acknowledgements, loss and retransmission, receive windows, MSS segmentation, and orderly close;
- DNS records, message roles, recursion/iteration, caching, aliases, and UDP/TCP transport;
- DHCPv4 discovery, offer, request, acknowledgement, leases, and relays;
- HTTP/1.1 request/response syntax, message framing, and connection reuse;
- conceptual HTTP/2 stream multiplexing;
- TLS 1.3 handshake roles, SNI, ALPN, certificate identity, and protected application data;
- QUIC's relationship to UDP, TLS, connection IDs, and independent streams;
- source NAT/PAT, destination NAT/port forwarding, connection tracking, and first-match rule sets;
- synthetic packet decoding, timeline reconstruction, and evidence-bounded diagnosis.

Expected prior knowledge:

- binary and hexadecimal notation;
- unsigned addition and subtraction;
- powers of two;
- ordinary IPv4 dotted-decimal notation;
- the broad meanings of client, server, address, and port.

The app supplies a compact CIDR refresher. Deep subnet arithmetic may link to Admin Practice rather than dominate this topic.

### Pinned conventions and protocol profiles

Questions must name a profile whenever real implementations have legitimate alternatives.

#### Byte and display conventions

- Multi-byte integer fields are encoded in network byte order: most significant byte first.
- Byte offsets are zero-based.
- A byte dump groups octets with spaces; offsets appear at the left when useful.
- Hexadecimal is case-insensitive on input. Feedback displays two uppercase hex digits per byte.
- Bit diagrams number a field from its protocol-defined most-significant bit; they must not reuse little-endian CPU bit diagrams without labels.
- Internet checksums use 16-bit one's-complement addition with end-around carry, followed by one's complement.

#### Synthetic address space

- IPv4 examples use `192.0.2.0/24`, `198.51.100.0/24`, and `203.0.113.0/24` unless a deliberately private-address NAT exercise needs RFC 1918 space.
- IPv6 examples use `2001:db8::/32`.
- DNS uses `.test`.
- Generated MAC addresses are unicast locally administered addresses unless a protocol-defined multicast or broadcast address is required. Their first octet therefore has the individual/group bit clear and local bit set.
- The app never queries or contacts a displayed address.

#### Ethernet profile

- “Ethernet frame length” means destination MAC through FCS, excluding the 7-byte preamble, 1-byte start-frame delimiter, and interpacket gap.
- An untagged Ethernet II frame has 6 destination bytes, 6 source bytes, a 2-byte EtherType, 46–1500 payload/pad bytes, and a 4-byte FCS: 64–1518 bytes by the definition above.
- An 802.1Q tag adds four bytes between source MAC and the encapsulated EtherType. Initial tagged-size questions ask only the `+4` change or provide all components; they do not rely on disputed informal uses of “minimum tagged frame.”
- FCS values themselves are not calculated in v1. Learners identify its coverage and account for its four bytes.
- Preamble, SFD, FCS, padding, and interpacket gap are never silently included or omitted.
- Supported EtherTypes are IPv4 `0x0800`, ARP `0x0806`, VLAN TPID `0x8100`, and IPv6 `0x86DD`.

#### Switching and VLAN profile

- A switch learns the source MAC on the ingress port and VLAN before making its forwarding decision.
- Known unicast is forwarded only to the learned eligible egress port; unknown unicast and broadcast are flooded to eligible ports in the same VLAN except the ingress port.
- The generated topology has no loop and needs no spanning-tree simulation.
- Access-port ingress is untagged and assigned to its configured VLAN; access egress is untagged.
- Trunks in v1 carry only explicitly allowed tagged VLANs. There is no native VLAN.
- A forwarding database entry is keyed by `(VLAN, MAC)` and has an explicit remaining lifetime when aging matters.

#### ARP and Neighbor Discovery profile

- IPv4 resolves the link-layer address of the on-link next hop: the final destination when it is on-link, otherwise the selected gateway.
- An ARP request is sent to Ethernet broadcast; the intended request target need not already know the sender.
- Ordinary ARP replies in fixtures are unicast. Gratuitous ARP, proxy ARP, and security-policy behavior are excluded unless a future profile names them.
- IPv6 uses ICMPv6 Neighbor Discovery, not ARP.
- A target's solicited-node multicast address is `ff02::1:ffXX:XXXX`, formed from the low 24 target-address bits. Its Ethernet multicast address is `33:33:ff:XX:XX:XX`.
- Generated Neighbor Discovery messages have IPv6 hop limit 255; a received ND message with another hop limit fails the modeled validity check.
- Neighbor-cache state may use `INCOMPLETE`, `REACHABLE`, `STALE`, `DELAY`, and `PROBE`, but a question displays the timers and events needed to decide the transition.

#### IP profile

- IPv4 questions normally use a 20-byte header with no options. If options occur, IHL and option length are explicit.
- A router decrements IPv4 TTL or IPv6 Hop Limit once. If it becomes zero, the router discards the packet and generates the applicable time-exceeded message.
- On an ordinary routed hop, source and destination IP addresses remain unchanged while Ethernet source and destination addresses are replaced. IPv4's header checksum is updated. NAT is the named exception.
- IPv4 fragment offsets count 8-byte units. Every non-final fragment payload length is a multiple of eight bytes.
- The IPv4 reassembly key is `(source, destination, protocol, identification)`. The v1 model rejects overlapping fragments.
- The IPv6 base header is 40 bytes. IPv6 routers do not fragment packets; only a source uses a Fragment extension header.
- The IPv6 minimum link MTU is 1280 bytes.
- Route selection uses the longest matching prefix, then the lowest displayed metric for equal prefixes. Policy routing and ECMP are excluded.

#### Transport and application profile

- UDP length includes its 8-byte header.
- In the ordinary IPv6 profile, a UDP zero checksum is invalid. UDP checksum arithmetic is optional advanced content; checksum field rules are core.
- A TCP connection is identified by protocol plus local and remote address/port pairs.
- TCP sequence and acknowledgement numbers count bytes. SYN and FIN each consume one sequence number; a pure ACK consumes none. An acknowledgement is the next byte expected.
- TCP acknowledgement arithmetic is modulo `2^32` only in a separately labeled wraparound variation.
- HTTP exercises use HTTP/1.1 as specified by the profile and reject ambiguous fixtures with conflicting framing.
- TLS exercises use the current pinned TLS 1.3 profile. They reason about messages and guarantees, not cryptographic primitive arithmetic.
- QUIC exercises use bounded concepts from QUIC v1 and its TLS mapping; they do not require decrypting packets.

### Exclusions

- live packet capture, raw sockets, WebRTC discovery, port scanning, packet injection, or access to local interfaces;
- use of learner credentials, hostnames, cookies, traffic, or browser network state;
- exploitation, evasion, spoofing attacks, denial of service, credential interception, or instructions for attacking networks;
- Wi-Fi MAC/PHY details, radio planning, cellular networking, Bluetooth, and industrial fieldbuses;
- analog signal integrity, transmission lines, connector pinouts, and physical-layer encoding;
- spanning tree, link aggregation, MACsec, QinQ, EVPN, VXLAN, MPLS, and software-defined networking;
- full OSPF, IS-IS, BGP, multicast routing, policy routing, ECMP, and route redistribution;
- IPsec, VPN configuration, DNSSEC validation, DHCPv6, SEND, Mobile IP, and IPv6 privacy-address generation;
- TCP congestion-control algorithms, SACK scoreboard implementation, TCP options beyond MSS, and implementation-specific retransmission timers;
- HTTP caching policy, HPACK/QPACK bitstreams, full HTTP/2 or HTTP/3 wire parsing, certificate ASN.1, and cryptographic calculations;
- vendor command syntax, cloud control planes, firewall-product semantics, and operating-system-specific socket APIs;
- unbounded PCAP parsing or a general standards-conformance suite.

These are possible later topics, but adding them requires a named model extension and its own validation corpus.

### Global answer conventions

- Surrounding whitespace is ignored.
- Protocol names, DNS names, and hexadecimal digits are checked case-insensitively unless a payload-byte question explicitly says otherwise.
- IPv4 answers are normalized to dotted decimal.
- IPv6 answers are parsed to 128 bits and compared semantically. Any valid equivalent compression/case is accepted.
- MAC addresses accept colon- or hyphen-separated pairs and are compared as six bytes.
- Integers accept decimal unless the prompt requests hex. A `0x` prefix is optional for a hex-only field.
- Sizes require the stated unit. `B` means bytes and `b` means bits; they are not interchangeable.
- Ordered message sequences accept arrow-separated or comma-separated tokens when typing is used.
- Sets and table selections are order-insensitive; timelines are order-sensitive.
- A multiple-part answer is correct only when every required field is correct, but feedback grades fields independently.
- Free-form causal prose is not the primary answer mode. Diagnosis uses choices, ordered causes, or controlled labels so equivalent wording does not become a grading problem.

### Difficulty philosophy

Difficulty should increase through:

- moving from field recognition to deriving a field from surrounding state;
- crossing a layer boundary while preserving the right invariants;
- introducing one additional table, header, timer, or device;
- requiring an event sequence rather than one isolated lookup;
- weakening cues and contrasting plausible protocols;
- distinguishing similar failure signatures with decisive evidence;
- composing already-mastered operations into an end-to-end trace.

Difficulty must not increase merely through enormous byte dumps, excessive checksum arithmetic, arbitrary memorization of port numbers, undocumented implementation quirks, unreadable diagrams, or hidden assumptions. A hard item should reveal a better network mental model, not reward clerical endurance.

### Shared family contract

Every family below inherits these requirements:

- All displayed values are generated from a semantic packet/topology/event model, never from independently randomized text.
- “Constraints” includes both instance constraints and rejection rules.
- “Difficulty” describes independent dimensions, not just a global level.
- Every choice distractor is derived from a named misconception. Arbitrary nearby numbers are forbidden.
- Correct feedback states the decisive rule. Incorrect feedback identifies the first divergence and then offers a layer-colored worked trace.
- Each example is fully instantiated; `L1`–`L5` indicate increasing reasoning demand.
- Validation uses a second oracle or a reversible invariant where practical, checks unique answers, and fuzzes many seeds.
- Coverage balances direction, protocol/address family, boundary cases, positive/negative results, and misconceptions while suppressing recent structural duplicates.

## 2. Category: Encapsulation and packet representation

### Category purpose

Build a stable picture of what a protocol data unit contains, how an upper-layer object becomes payload, and how bytes on the wire map to fields.

### Learn

Each layer adds information for its own job. For a simple web exchange, HTTP data sits in TCP, TCP sits in IP, and IP sits in Ethernet on each local link. A router normally replaces the link-layer envelope while forwarding the IP packet. A receiver uses type/protocol fields to decide which parser should receive the payload.

Network-order multi-byte fields place their most significant byte first. Length questions are meaningful only after the counted boundary is named.

### Prerequisites

Hex bytes, unsigned integers, and the concepts of header and payload.

### Category boundaries

This category reads generic nesting and fields. Ethernet forwarding belongs in Category 3; IP forwarding belongs in Category 5; transport state belongs in Category 7.

### Subcategories

1. Layer and PDU roles
2. Encapsulation
3. Byte fields and lengths
4. Demultiplexing

### Family `layer_pdu_match`

**Task and relationship.** Match a device action, identifier, or data unit to link, internet, transport, or application layer; this prevents later “all addresses are the same” errors.

**Response and template.** Matching. `Match each item to its primary layer in this model: {items}.`

**Generation and derivation.** Draw 4–8 items from frame/MAC/EtherType, packet/IP/TTL, segment-or-datagram/port, and message/application semantics. Map using the pinned model.

**Constraints.** Avoid contested textbook layer counts and items spanning layers unless the prompt asks for “primary.” Every label has one intended match.

**Difficulty.** L1 concrete PDU names; L2 identifiers and devices; L3 actions such as retransmission or next-hop selection; L4 mixed trace evidence.

**Misconceptions/distractors.** Port as an IP property, MAC as end-to-end, DNS as transport, router as modifying TCP.

**Examples.**

1. `MAC address` → link; `IP address` → internet; `port` → transport. L1.
2. `decrement Hop Limit` → internet; `cumulative ACK` → transport. L2.
3. `choose HTTP body length from Content-Length` → application; `replace destination MAC at a router` → link. L3.

**Validation/coverage.** Schema-enumerate all terms; cover every layer equally and reject synonym collisions.

### Family `encapsulation_order`

**Task and relationship.** Put supplied protocol units in outer-to-inner or send-processing order, reinforcing nesting rather than acronym recall.

**Response and template.** Ordered sequence. `On this Ethernet link, order {units} from outermost to innermost.`

**Generation and derivation.** Construct a valid stack from Ethernet, optional VLAN, IPv4/IPv6, UDP/TCP, optional TLS/QUIC, and an application message. Traverse containment edges.

**Constraints.** The stack is explicitly named; QUIC is carried over UDP and its TLS use is not represented as a separate TCP-like wrapper.

**Difficulty.** L1 three units; L2 four/five; L3 compare HTTPS over TCP with HTTP/3 over QUIC; L4 identify a missing/invalid ordering.

**Misconceptions/distractors.** IP outside Ethernet on a link, TLS below TCP, QUIC over TCP, VLAN as application data.

**Examples.**

1. `{Ethernet, IPv4, UDP, DNS}` → Ethernet → IPv4 → UDP → DNS. L1.
2. `{HTTP/1.1, TLS, TCP, IPv6, Ethernet}` → Ethernet → IPv6 → TCP → TLS → HTTP/1.1. L2.
3. `{HTTP/3, QUIC, UDP, IPv6, Ethernet}` → Ethernet → IPv6 → UDP → QUIC → HTTP/3. L3.

**Validation/coverage.** Topological-sort oracle; vary IP family and transport without allowing multiple valid orders.

### Family `header_payload_length`

**Task and relationship.** Compute one length from explicitly named headers, payload, padding, and counting boundary.

**Response and template.** Integer plus unit. `{structure} contains {components}. What is the {named_length}?`

**Generation and derivation.** Sum only components within the requested boundary; for Ethernet, pad payload below 46 bytes before adding FCS when frame length is requested.

**Constraints.** No implicit options/tags. State whether FCS, preamble/SFD, or tunnel headers count. Reject totals that overflow their fields.

**Difficulty.** L1 direct sum; L2 infer padding; L3 nested lengths; L4 solve missing payload or compare MTU versus frame length.

**Misconceptions/distractors.** Include preamble, omit FCS, treat Ethernet MTU as full frame, count UDP's 8-byte header twice.

**Examples.**

1. IPv4 header 20 B + UDP header 8 B + data 32 B → IPv4 Total Length `60 B`. L1.
2. Ethernet payload 20 B is padded to 46 B → frame length `6+6+2+46+4=64 B`. L2.
3. 802.1Q frame with 14 B base header, 4 B tag, 1500 B payload, 4 B FCS → `1522 B`. L3.

**Validation/coverage.** Component-sum and inverse equations; boundary tests at payload 0, 45, 46, 1500.

### Family `network_byte_order`

**Task and relationship.** Convert between a multi-byte unsigned field and its byte sequence.

**Response and template.** Hex byte string or integer. `Encode/decode {value_or_bytes} as a {width}-bit network-order field.`

**Generation and derivation.** For 16 or 32 bits, emit bytes from most- to least-significant; decoding shifts accumulated value left eight then adds the next byte.

**Constraints.** Fixed widths; no signed interpretation; leading zero bytes remain visible.

**Difficulty.** L1 16-bit familiar value; L2 zero/high bytes; L3 32-bit; L4 locate a field at an offset before decoding.

**Misconceptions/distractors.** Reverse bytes as little-endian, drop a leading zero, parse decimal-looking hex.

**Examples.**

1. `0x0800` as 16 bits → `08 00`. L1.
2. bytes `01 BB` → `0x01BB` = `443`. L2.
3. bytes `12 34 00 05` → `0x12340005`. L3.

**Validation/coverage.** Encode/decode round trip and exhaustive 16-bit boundary suite.

### Family `demultiplex_field`

**Task and relationship.** Choose the next parser or receiving endpoint from EtherType, IP protocol/Next Header, and destination port.

**Response and template.** Single choice or ordered labels. `Given {header_fields}, what receives the payload next?`

**Generation and derivation.** Apply only the current layer's discriminator, then optionally continue down a supplied chain. Port-to-service mappings are stated in the fixture except a small taught set.

**Constraints.** A port suggests a configured service; it does not prove one is listening. EtherType and Next Header have unique modeled mappings.

**Difficulty.** L1 one discriminator; L2 three-stage chain; L3 mismatch between familiar port and declared service; L4 extension-header chain.

**Misconceptions/distractors.** Use source port, guess from payload appearance, skip an IPv6 extension header, treat `0x0806` as IPv4.

**Examples.**

1. EtherType `0x0806` → ARP. L1.
2. IPv4 Protocol `6`, destination port `443`, declared HTTPS listener → TCP then that listener. L2.
3. IPv6 Next Header `0`, Hop-by-Hop Next Header `17` → Hop-by-Hop then UDP. L3.

**Validation/coverage.** Registry subset table plus declared socket table; balance all supported discriminators.

### Family `packet_path_header_change`

**Task and relationship.** Mark fields that remain invariant or change across a router, switch, or NAT.

**Response and template.** Multiple choice table. `Packet state before {device} is {before}. Fill the fields after it.`

**Generation and derivation.** Apply device semantics: a switch preserves ordinary frame contents; a router rewrites link addresses and decrements TTL/Hop Limit; NAT additionally applies its mapping.

**Constraints.** No middleboxes unless shown. Checksums are shown as “recomputed” unless a separate arithmetic question requests their value.

**Difficulty.** L1 switch; L2 router; L3 router plus NAT; L4 two hops and VLAN boundaries.

**Misconceptions/distractors.** Decrement TTL at a switch, change end-to-end IP on every hop, preserve destination MAC across routers, rewrite destination port under source NAT.

**Examples.**

1. Frame crosses one learning switch → MAC/IP/TTL values unchanged. L1.
2. IPv4 packet crosses router: TTL `64→63`, Ethernet source/destination replaced, IP endpoints unchanged. L2.
3. Outbound PAT: source `10.0.0.5:52000→203.0.113.9:40001`; destination and TCP sequence unchanged. L3.

**Validation/coverage.** Immutable/mutable field masks and forward/reverse transition checks.

### Cross-family progression

Begin with layers and direct nesting, then byte order and explicit lengths. Interleave demultiplexing only after the learner can identify each header. Header-change traces bridge into Ethernet switching and IP forwarding.

## 3. Category: Ethernet switching and VLANs

### Category purpose

Train exact local-link reasoning: interpret frames and addresses, update a switch's forwarding database, and decide where a frame is eligible to leave.

### Learn

Ethernet delivers frames on one link-layer domain. A bridge learns from source addresses, never from the destination field. It forwards a known unicast toward its learned port and floods an unknown unicast or broadcast only within the relevant VLAN. VLANs create separate link-layer broadcast domains even when they share one physical switch.

### Prerequisites

Category 2.

### Category boundaries

Do not ask how a host selects its IP next hop here; ARP/ND and routing own that decision. No spanning-tree behavior or switch CLI.

### Subcategories

1. Frame fields and address classes
2. Source learning and forwarding
3. VLAN tags and isolation

### Family `mac_address_classify`

**Task and relationship.** Classify destination MAC addresses as individual, multicast, or broadcast and identify locally administered examples.

**Response and template.** Multiple named labels. `Classify {mac}; what do the low two bits of its first octet imply?`

**Generation and derivation.** Inspect the first transmitted octet's least significant bit for individual/group and next bit for universal/local; all-ones is broadcast.

**Constraints.** Do not conflate textual left-to-right bit position with on-medium bit transmission diagrams. Locally administered is independent of unicast/multicast.

**Difficulty.** L1 broadcast; L2 local unicast; L3 multicast and local/global two-axis classification.

**Misconceptions/distractors.** Use last octet, treat any `FF` as broadcast, assume local means multicast.

**Examples.**

1. `FF:FF:FF:FF:FF:FF` → broadcast. L1.
2. `02:10:20:30:40:50` → locally administered individual. L2.
3. `33:33:FF:12:34:56` → multicast because I/G=1; it is the recognizable Ethernet prefix used for IPv6 multicast mappings. L3.

**Validation/coverage.** Bit-mask oracle; cover all four I/G × U/L combinations plus broadcast.

### Family `ethernet_frame_parse`

**Task and relationship.** Decode destination, source, optional tag, EtherType, payload boundary, and FCS from a compact byte strip.

**Response and template.** Multiple named fields. `Decode this {profile} frame: {bytes}.`

**Generation and derivation.** Serialize a semantic frame, then slice by fixed offsets; if TPID is `0x8100`, read four tag bytes before the encapsulated EtherType.

**Constraints.** Byte strips remain at most 40 displayed bytes with payload ellipsis and declared total length. FCS may be symbolic.

**Difficulty.** L1 labeled untagged; L2 unlabeled; L3 tagged; L4 identify a malformed/truncated header.

**Misconceptions/distractors.** Swap source/destination, read first EtherType after a VLAN tag as payload type, include FCS in payload.

**Examples.**

1. `DA=02:00:00:00:00:02 SA=02:00:00:00:00:01 Type=08 00` → IPv4. L1.
2. raw first 14 bytes `FF FF FF FF FF FF 02 00 00 00 00 01 08 06` → broadcast ARP. L2.
3. `... 81 00 00 64 86 DD ...` → VLAN ID 100, encapsulated IPv6. L3.

**Validation/coverage.** Serialize/parse round trip, offset assertions, malformed-length rejection.

### Family `switch_source_learning`

**Task and relationship.** Update a per-VLAN forwarding database after one or more received frames.

**Response and template.** Table edit. `Switch receives {frames}. What is its FDB afterward?`

**Generation and derivation.** In event order, set `(VLAN, source MAC)→ingress port` and refresh lifetime; a moved source overwrites its former port.

**Constraints.** Never learn broadcast/multicast source addresses; generated valid hosts use individual sources. Aging occurs only when an elapsed time is shown.

**Difficulty.** L1 empty FDB; L2 existing entries; L3 MAC move/refresh; L4 interleaved VLANs and expiration.

**Misconceptions/distractors.** Learn destination, add one source on every port, omit VLAN key, retain stale old port.

**Examples.**

1. empty FDB, source A arrives on p1 VLAN10 → `(10,A)=p1`. L1.
2. A on p1 then B on p3, both VLAN10 → two entries. L2.
3. `(10,A)=p1`, then A arrives p4 VLAN10 → entry becomes p4. L3.

**Validation/coverage.** Deterministic event replay; include learn, refresh, move, age, and same MAC in two VLANs.

### Family `switch_forwarding_decision`

**Task and relationship.** Choose exact egress ports after learning on ingress.

**Response and template.** Port set plus action label. `Given {ports}, {FDB}, and frame {frame}, where is it forwarded?`

**Generation and derivation.** Learn source first; look up destination in the frame VLAN; forward known unicast to one eligible port, filter if that is ingress, otherwise flood eligible ports except ingress.

**Constraints.** Port/VLAN eligibility is explicit. No loops, STP, link aggregation, or port security.

**Difficulty.** L1 broadcast; L2 known/unknown unicast; L3 ingress filtering; L4 learn-before-forward interaction.

**Misconceptions/distractors.** Flood known unicast, send back on ingress, look up source, flood across VLANs.

**Examples.**

1. VLAN10 ports p1,p2,p3; broadcast enters p1 → p2,p3. L1.
2. FDB `(10,B)=p3`; frame A→B enters p1 → p3. L2.
3. FDB initially `(10,A)=p4`; A→C enters p2, C unknown → learn A=p2 and flood p1,p3,p4. L3.

**Validation/coverage.** Reference bridge function; verify no egress equals ingress and no VLAN escape.

### Family `vlan_tag_fields`

**Task and relationship.** Decode or construct the PCP, DEI, VID, and encapsulated EtherType around one 802.1Q tag.

**Response and template.** Named fields or 16-bit hex. `For tag control value {tci}, give PCP, DEI, and VLAN ID.`

**Generation and derivation.** TCI bits 15–13 are PCP, bit 12 DEI, bits 11–0 VID; encode by shifts and OR.

**Constraints.** Ordinary generated VLAN IDs are 1–4094; VID 0 and 4095 appear only in explicit recognition questions.

**Difficulty.** L1 identify VID from annotated bits; L2 decode hex; L3 construct TCI; L4 combine tag offsets with frame parsing.

**Misconceptions/distractors.** Treat all 16 bits as VID, swap PCP and DEI, decode little-endian.

**Examples.**

1. TCI `0x0064` → PCP0, DEI0, VID100. L1.
2. TCI `0xA02A` → PCP5, DEI0, VID42. L2.
3. PCP3, DEI1, VID20 → `0x7014`. L3.

**Validation/coverage.** Encode/decode round trip; exhaustive field-boundary tests.

### Family `vlan_port_transform`

**Task and relationship.** Determine the frame's VLAN and tagged/untagged form at access/trunk ingress and egress.

**Response and template.** VLAN, acceptance/drop, and egress tag state. `Frame {frame} enters {port}; apply {port_config}.`

**Generation and derivation.** Untagged access ingress receives the access VLAN; trunk accepts only a tag whose VID is allowed; access egress strips the modeled VLAN tag and trunk egress carries it.

**Constraints.** No native VLAN or voice VLAN. A tagged frame on an access port is rejected in v1.

**Difficulty.** L1 access ingress; L2 trunk; L3 access-to-trunk path; L4 wrong/forbidden tag.

**Misconceptions/distractors.** Treat physical port as VLAN, preserve a tag to an access host, allow every trunk VLAN.

**Examples.**

1. untagged frame enters access VLAN20 → internal VLAN20. L1.
2. VLAN20 exits trunk allowed `{10,20}` → tagged VID20. L2.
3. tagged VLAN30 enters trunk allowed `{10,20}` → dropped. L3.

**Validation/coverage.** Port-state transition table; balance accepted and rejected paths.

### Family `vlan_forwarding_isolation`

**Task and relationship.** Trace a frame across several access/trunk ports while preserving broadcast-domain isolation.

**Response and template.** Ordered links/ports and tag state. `Trace {frame} through topology {topology}. Which hosts receive it?`

**Generation and derivation.** Assign an internal VLAN at ingress, apply per-VLAN FDB/flooding at each switch, and transform tags on egress.

**Constraints.** Acyclic topology of at most three switches and eight hosts. Every inter-switch link declares allowed VLANs.

**Difficulty.** L1 one switch; L2 two switches/trunk; L3 identical MAC in two VLANs; L4 unknown-unicast flood constrained by several trunks.

**Misconceptions/distractors.** Broadcast reaches all physical ports, tag changes the IP subnet automatically, FDB entry shared across VLANs.

**Examples.**

1. H1 and H2 access VLAN10, H3 VLAN20; H1 broadcasts → H2 only. L1.
2. H1 VLAN10 on S1, H2 VLAN10 on S2, trunk allows10 → H2 receives tagged across trunk. L2.
3. trunk allows20 only; VLAN10 broadcast on S1 → no S2 host receives it. L3.

**Validation/coverage.** Graph traversal with VLAN invariant; renderer and simulator share the topology AST.

### Cross-family progression

Classify addresses before parsing whole frames. Teach learning separately from forwarding, then interleave them. Decode a tag before asking port transformations. Multi-switch isolation is reserved until both forwarding and tag state are reliable.

## 4. Category: ARP and IPv6 Neighbor Discovery

### Category purpose

Train the crucial distinction between selecting an IP next hop and discovering the link-layer address needed to reach that next hop.

### Learn

A host first decides whether the final IP destination is on-link. If it is, it resolves that destination's link address. If it is not, it resolves the selected router's on-link address. ARP performs this job for IPv4. IPv6 Neighbor Discovery uses ICMPv6 messages and multicast mappings, while also supporting router discovery, reachability detection, and duplicate-address detection.

### Prerequisites

Categories 2–3 and basic prefix membership.

### Category boundaries

Routing-table selection is practiced in Category 5. This category begins with a selected route or a small local route table and ends when the next-hop link address/cache state is known.

### Subcategories

1. Next-hop resolution
2. ARP exchanges and caches
3. IPv6 multicast derivation and ND
4. Router discovery and address configuration

### Family `next_hop_resolution_target`

**Task and relationship.** Identify which IPv4/IPv6 address the sender must resolve at link layer.

**Response and template.** IP address plus reason. `Host {host} sends to {destination} using {routes}. Which IP address must it resolve on {interface}?`

**Generation and derivation.** Select longest-prefix route; if connected/on-link, target is destination, otherwise target is route next hop.

**Constraints.** Selected next hop is itself on-link; no recursive next-hop ambiguity.

**Difficulty.** L1 same subnet; L2 default gateway; L3 overlapping route; L4 IPv6 link-local router next hop.

**Misconceptions/distractors.** Always resolve final destination, resolve DNS server, resolve public destination through ARP, resolve own interface.

**Examples.**

1. host `192.0.2.10/24` → `192.0.2.80` → resolve `192.0.2.80`. L1.
2. same host → `198.51.100.7`, default via `192.0.2.1` → resolve `192.0.2.1`. L2.
3. IPv6 default via `fe80::1%eth0` → resolve `fe80::1` on `eth0`. L3.

**Validation/coverage.** Route oracle followed by on-link assertion; equal share direct/gateway targets.

### Family `arp_request_construct`

**Task and relationship.** Fill Ethernet and ARP fields for a request after the resolution target is known.

**Response and template.** Multiple named fields. `{sender} needs the MAC for {target_ip}. Complete the ARP request.`

**Generation and derivation.** Ethernet destination broadcast; source sender MAC; EtherType ARP; ARP operation request; sender addresses are the sender's; target protocol address is target; unknown target hardware field is all zero in this model.

**Constraints.** Sender/target share the link and IPv4 address family. Do not ask for actual numeric FCS.

**Difficulty.** L1 labeled fields; L2 raw table; L3 gateway target after route selection; L4 detect a malformed request.

**Misconceptions/distractors.** Ethernet destination target's unknown MAC, target IP final off-link host, swap sender/target, unicast request.

**Examples.**

1. A `192.0.2.10/02:00:00:00:00:0A` asks for `.20` → Ethernet dst broadcast, ARP target IP `.20`. L1.
2. off-link destination via `.1` → ARP target IP `.1`, not remote destination. L2.
3. request with Ethernet dst `02:...:01` despite empty cache → malformed for ordinary v1 request. L3.

**Validation/coverage.** Serialize semantic ARP request and assert operation/address relationships.

### Family `arp_reply_cache_update`

**Task and relationship.** Derive reply fields and resulting neighbor-cache entry.

**Response and template.** Frame fields plus cache row. `Host {target} receives {request}. Complete its ordinary ARP reply and both learned entries.`

**Generation and derivation.** Reply sender fields describe target; reply target fields describe requester; Ethernet is unicast to requester. On receiving a valid mapping, update the corresponding cache entry and lifetime.

**Constraints.** Exactly one owner of target IP; no proxy/gratuitous ARP; cache-learning behavior is declared for request receiver and reply receiver.

**Difficulty.** L1 reply direction; L2 both caches; L3 overwrite stale mapping; L4 ignore a reply that fails displayed validation.

**Misconceptions/distractors.** Broadcast reply, preserve request operation, cache IP-to-IP, update mapping with Ethernet destination rather than ARP sender.

**Examples.**

1. B owns `.20/MAC-B`, request from A → reply Ethernet `B→A`, ARP “`.20 is at MAC-B`.” L1.
2. A receives reply → cache `.20→MAC-B`. L1.
3. A had expired `.20→MAC-C`; valid reply from B → replace with MAC-B and reset shown lifetime. L3.

**Validation/coverage.** Request/reply inverse invariant and cache-event replay.

### Family `arp_cache_trace`

**Task and relationship.** Predict whether a packet is sent immediately, queued for resolution, or causes a retry/failure as cache time evolves.

**Response and template.** Ordered events and final cache state. `At times {events}, host has {cache}. Trace delivery of {packets}.`

**Generation and derivation.** A valid entry supplies the destination MAC; missing/expired entry creates one resolution process and queues dependent packets; reply resolves and releases them; retry limit produces failure.

**Constraints.** Timers and retry counts are displayed. Concurrent events have an explicit order.

**Difficulty.** L1 hit/miss; L2 expiry; L3 two queued packets share one request; L4 timeout followed by later retry.

**Misconceptions/distractors.** ARP every packet, use expired mapping forever, send queued IP packet before reply, start duplicate independent requests.

**Examples.**

1. valid `.1→MAC-R` for 20 s; send now → immediate Ethernet frame to MAC-R. L1.
2. entry expired; send → queue packet and broadcast request. L2.
3. two sends at t0/t1 while resolution pending, reply t2 → one request and then two frames. L3.

**Validation/coverage.** Discrete-event simulator with queue/cache invariants and explicit simultaneous-event ordering.

### Family `solicited_node_multicast`

**Task and relationship.** Derive the IPv6 and Ethernet multicast destinations used for Neighbor Solicitation.

**Response and template.** IPv6 multicast plus MAC. `For target IPv6 {target}, derive its solicited-node multicast address and Ethernet destination.`

**Generation and derivation.** Copy the low 24 target bits into `ff02::1:ff00:0/104`; map the low 32 multicast bits to `33:33:XX:XX:XX:XX`.

**Constraints.** Full target parses as 128 bits before suffix extraction. Avoid text-slicing compressed IPv6.

**Difficulty.** L1 expanded suffix; L2 compressed target; L3 leading-zero suffix; L4 distinguish target unicast, multicast IP, and multicast MAC in a packet.

**Misconceptions/distractors.** Use low 32 rather than 24 for solicited-node address, copy textual last group incorrectly, use broadcast MAC, use target unicast MAC.

**Examples.**

1. target `2001:db8::1234:5678` → `ff02::1:ff34:5678`, `33:33:ff:34:56:78`. L2.
2. target `2001:db8::2` → `ff02::1:ff00:2`, `33:33:ff:00:00:02`. L2.
3. target ending `AB:CD:EF` → multicast suffix `ffab:cdef`, MAC suffix `ff:ab:cd:ef`. L3.

**Validation/coverage.** 128-bit mask/OR oracle and semantic IPv6 normalization.

### Family `nd_ns_na_trace`

**Task and relationship.** Execute a bounded Neighbor Solicitation/Advertisement exchange and update neighbor state.

**Response and template.** Ordered messages plus cache state. `{node} sends to {neighbor}; trace NS/NA using {cache_state}.`

**Generation and derivation.** Missing entry becomes INCOMPLETE and sends NS to target solicited-node multicast; valid target replies with NA under displayed solicited/override flags; receiver records link-layer option and becomes REACHABLE under the simplified solicited-reply path.

**Constraints.** Hop Limit must be 255; option contents and flags are displayed; no SEND/proxy/redirect behavior.

**Difficulty.** L1 ordinary resolution; L2 stale-to-delay/probe; L3 unsolicited NA/override rule supplied; L4 reject invalid hop limit or inconsistent target.

**Misconceptions/distractors.** Use ARP, send NS to all-nodes multicast, accept hop limit 64, confuse router flag with solicited flag.

**Examples.**

1. no entry for `2001:db8::20` → INCOMPLETE, NS to its solicited-node multicast. L1.
2. solicited NA includes MAC-B → entry becomes REACHABLE/MAC-B. L2.
3. otherwise valid NS arrives with Hop Limit64 → discard in this model. L3.

**Validation/coverage.** ND state transition table and message validity predicates.

### Family `router_advertisement_slaac_dad`

**Task and relationship.** Interpret an RS/RA prefix and trace bounded SLAAC plus duplicate-address detection.

**Response and template.** Address/status and ordered messages. `Interface {interface_id} receives {RA}. Form the candidate and apply {DAD_events}.`

**Generation and derivation.** Use a supplied 64-bit interface identifier with an autonomous `/64` prefix; form the 128-bit candidate; DAD sends NS with unspecified source and decides unique/duplicate from shown responses.

**Constraints.** Interface identifier is supplied, not invented from a MAC. Prefix length `/64`; privacy addresses and temporary-address lifetimes excluded. RA router lifetime/default-route effect is explicit.

**Difficulty.** L1 read prefix/default router; L2 form address; L3 successful DAD; L4 duplicate response or expired router lifetime.

**Misconceptions/distractors.** DHCPv4 DORA for IPv6 SLAAC, use RA sender's global address instead of link-local router, treat RA as proof candidate is unique.

**Examples.**

1. prefix `2001:db8:1:2::/64`, IID `::1234` → candidate `2001:db8:1:2::1234`. L2.
2. no DAD response during stated interval → candidate becomes usable. L3.
3. NA claims candidate during DAD → duplicate; do not assign it. L3.

**Validation/coverage.** Bit concatenation plus deterministic DAD event model; balance success and duplicate.

### Cross-family progression

Teach the address to resolve before message construction. ARP request/reply precedes cache timing. IPv6 multicast derivation precedes NS/NA state. Router advertisement and DAD are later because they combine multicast, address formation, and timers.

## 5. Category: IPv4, IPv6, and forwarding

### Category purpose

Train reliable interpretation of IP headers and the forwarding decision that carries a packet across multiple links.

### Learn

IP addresses identify interfaces at the internet layer. A router chooses the longest matching route, resolves the selected next hop on an outgoing link, replaces the link-layer frame, and decrements TTL or Hop Limit. IPv4 and IPv6 share this broad job but differ in header structure and fragmentation behavior.

### Prerequisites

Categories 2 and 4; binary prefix matching.

### Category boundaries

This category selects and forwards a packet. ICMP consequences and MTU discovery are in Category 6. NAT is in Category 10.

### Subcategories

1. Header fields and checksums
2. Route selection
3. Hop-by-hop forwarding
4. Fragmentation
5. IPv6 extension headers

### Family `ipv4_header_parse`

**Task and relationship.** Decode or validate version, IHL, total length, identification, flags/offset, TTL, protocol, checksum, and addresses.

**Response and template.** Named fields. `Decode the IPv4 header {bytes_or_diagram}.`

**Generation and derivation.** Parse version/IHL nibbles; header bytes=`IHL×4`; read all multi-byte fields in network order; payload length=`Total Length−header bytes`.

**Constraints.** Ordinary fixtures use IHL5; option fixtures explicitly show all option bytes. Total length is at least header length and available bytes.

**Difficulty.** L1 labeled fields; L2 raw 20-byte header; L3 IHL/options or fragmentation fields; L4 detect one semantic inconsistency.

**Misconceptions/distractors.** IHL as bytes, total length as payload only, little-endian fields, Protocol as a port.

**Examples.**

1. first byte `45`, Total Length `00 3C` → IPv4, 20-byte header, 60-byte packet, 40-byte payload. L1.
2. TTL `40`, Protocol `06` → TTL64, TCP. L2.
3. first byte `46`, Total Length `00 14` → invalid because IHL6 means a 24-byte header but Total Length says only20 bytes. L3.

**Validation/coverage.** Independent serializer/parser and declared-length consistency checks.

### Family `ipv4_checksum`

**Task and relationship.** Complete or verify a bounded IPv4 header checksum using one's-complement arithmetic.

**Response and template.** 16-bit hex. `With the checksum field zero, compute the one's-complement checksum of {words}.`

**Generation and derivation.** Sum 16-bit words, repeatedly fold carries into low 16 bits, then complement all bits. Verification including checksum must yield `0xFFFF`.

**Constraints.** Use 3–10 displayed words or an incremental update; never turn the family into twenty-word clerical work.

**Difficulty.** L1 no carry; L2 one/end-around carry; L3 verify supplied value; L4 adjust after a TTL word changes.

**Misconceptions/distractors.** Discard carry, two's-complement negate, byte-sum, forget to zero checksum during construction.

**Examples.**

1. words `0x4500,0x001C,0x0000` sum `0x451C` → checksum `0xBAE3`. L1.
2. `0xFFFF+0x0001` folds to `0x0001` → checksum `0xFFFE`. L2.
3. sum including supplied checksum is `0xFFFF` → valid. L2.

**Validation/coverage.** A byte-oriented oracle and word-oriented oracle must agree; property that verify(serialize(with checksum)) is all ones.

### Family `route_longest_prefix`

**Task and relationship.** Select the connected/static/default route and outgoing next hop.

**Response and template.** Route row, interface, and resolution target. `Given {route_table}, route destination {destination}.`

**Generation and derivation.** Retain matching prefixes, choose greatest prefix length, break equal length by lowest declared metric, then choose destination itself for connected route or displayed gateway.

**Constraints.** No ECMP/policy/source routing; next-hop reachability is valid. A no-route result appears when no default exists.

**Difficulty.** L1 connected/default; L2 overlaps; L3 equal-prefix metrics; L4 IPv6 prefixes and no match.

**Misconceptions/distractors.** First row wins, numerically smallest network, lowest metric across unequal prefixes, most recently listed.

**Examples.**

1. `/0→wan`, `10.0.0.0/8→lan`; destination `10.2.3.4` → `/8`, lan. L1.
2. add `10.2.0.0/16→vpn`; same destination → `/16`, vpn. L2.
3. `2001:db8::/32` and `2001:db8:1::/48`; `2001:db8:1::9` → `/48`. L2.

**Validation/coverage.** 32/128-bit prefix-mask oracle; insert nonmatching “tempting” rows and test boundary addresses.

### Family `ttl_hoplimit_trace`

**Task and relationship.** Track TTL/Hop Limit and disposition across a router path.

**Response and template.** Per-hop values and final status. `Packet starts with {limit} and crosses path {routers}. Where is it delivered or discarded?`

**Generation and derivation.** Each router decrements once; a router that obtains zero discards and does not forward. End hosts do not decrement merely on receipt.

**Constraints.** At most eight hops; no tunnels unless a separate overhead family names inner/outer behavior.

**Difficulty.** L1 sufficient limit; L2 expires exactly; L3 infer starting limit from observed value; L4 combine with traceroute probes.

**Misconceptions/distractors.** Decrement at switches/end host, forward with zero, decrement by packet length.

**Examples.**

1. TTL64 across three routers → arrives with61. L1.
2. TTL2: R1 forwards with1; R2 decrements to0 and discards. L2.
3. received Hop Limit57 after five routers → sender used62. L2.

**Validation/coverage.** Simple path replay; balance success, first-hop expiry, and interior expiry.

### Family `routed_packet_transform`

**Task and relationship.** Construct the outgoing Ethernet/IP state at each router hop.

**Response and template.** Timeline/table. `Forward {packet} through {topology}, using {routes} and {neighbor_tables}.`

**Generation and derivation.** At each router: validate destination, select route, decrement limit, update IPv4 checksum, choose next hop, obtain its MAC, and create a new frame.

**Constraints.** All needed neighbor entries or resolution events are shown; no NAT. At most three routers.

**Difficulty.** L1 one router with complete tables; L2 two routers; L3 one cache miss; L4 IPv4/IPv6 contrast.

**Misconceptions/distractors.** Preserve original frame MACs, use final host MAC on every link, change IP endpoints, decrement once for entire path.

**Examples.**

1. H→R→S: H frame `H-MAC→R-lan`; R emits `R-wan→S-MAC`, IP endpoints unchanged. L2.
2. TTL5 across two routers → outgoing values4 then3. L2.
3. R lacks next-hop neighbor entry → packet waits while R resolves on its egress; H does not resolve that remote hop. L3.

**Validation/coverage.** Layered state machine; assert each emitted frame's endpoints belong to its link.

### Family `ipv4_fragment_plan`

**Task and relationship.** Divide an IPv4 packet across a smaller MTU and calculate lengths, offsets, and MF.

**Response and template.** Ordered fragment table. `Fragment IPv4 payload {payload_size} B with header {header_size} B for MTU {mtu}.`

**Generation and derivation.** Maximum non-final payload=`floor((MTU−header)/8)×8`; emit chunks; offset is prior payload bytes/8; MF is 1 except last; each total length is header plus chunk.

**Constraints.** DF clear; header normally20 B; all results fit IPv4 fields. Include no copied-option complexity.

**Difficulty.** L1 two fragments; L2 three; L3 original offset/MF for re-fragmentation; L4 decide DF behavior separately.

**Misconceptions/distractors.** Offset in bytes, MTU applies to payload only, all chunks equal, MF on final, split headers across fragments.

**Examples.**

1. payload2000, MTU1500, header20 → payloads1480/520, offsets0/185, MF1/0, totals1500/540. L2.
2. payload4000 → 1480/1480/1040, offsets0/185/370, totals1500/1500/1060. L3.
3. total packet1500 on MTU1500 → one unfragmented packet. L1.

**Validation/coverage.** Reassemble generated fragments to exact payload interval; boundary tests around multiples of eight and MTU.

### Family `ipv4_reassembly`

**Task and relationship.** Determine completeness and reconstruct order/size from a fragment set.

**Response and template.** Status, ordered fragments, payload length. `Can {receiver} reassemble {fragments}?`

**Generation and derivation.** Group by reassembly key, convert offsets to byte intervals, require coverage from zero through the end marked by MF0 with no gaps/overlaps under v1.

**Constraints.** Overlap is an explicit invalid status; timeout is displayed when relevant; fragments may arrive out of order.

**Difficulty.** L1 reorder complete pair; L2 gap; L3 mixed identification keys; L4 duplicate/overlap/timeout.

**Misconceptions/distractors.** Reassemble at intermediate router, use arrival order, combine different IDs, infer end without MF0.

**Examples.**

1. offsets185 MF0 length520 and0 MF1 length1480 → complete 2000 B payload. L2.
2. intervals0–1479 and1488–1999 → gap8 B, incomplete. L3.
3. identical offsets but different Identification → different datagrams. L3.

**Validation/coverage.** Interval-set oracle; fragment shuffle leaves answer invariant.

### Family `ipv6_header_chain`

**Task and relationship.** Follow IPv6 Next Header values through a bounded extension-header chain.

**Response and template.** Ordered headers and final upper protocol. `Decode this IPv6 next-header chain: {headers}.`

**Generation and derivation.** Base Next Header selects first extension/upper layer; each extension's Next Header selects the following parser; use explicit per-header encoded lengths.

**Constraints.** At most three extension headers from Hop-by-Hop, Routing, Fragment, and Destination Options; ordering fixtures follow the pinned profile. No unknown-option action semantics.

**Difficulty.** L1 base→TCP; L2 one extension; L3 multiple and length offsets; L4 malformed/truncated chain.

**Misconceptions/distractors.** Treat first value as final transport, use IPv4 IHL, assume every extension is40 B.

**Examples.**

1. base Next Header6 → TCP. L1.
2. base0 → Hop-by-Hop Next Header17 → UDP. L2.
3. base44 → Fragment Next Header6 → TCP. L2.

**Validation/coverage.** Serialize/parse chain round trip and no cycles.

### Family `ipv4_ipv6_forwarding_contrast`

**Task and relationship.** Select the correct family-specific behavior in matched scenarios.

**Response and template.** Matching or single choice. `For {scenario}, choose IPv4, IPv6, both, or neither.`

**Generation and derivation.** Draw differences from fixed profile: ARP versus ND, router fragmentation versus source-only fragmentation, header checksum versus none, TTL versus Hop Limit, broadcast versus multicast.

**Constraints.** Avoid claims that depend on deployment prevalence. Ask protocol mechanics only.

**Difficulty.** L1 vocabulary; L2 forwarding behavior; L3 paired packet traces; L4 identify mixed-family impossible trace.

**Misconceptions/distractors.** IPv6 has no fragmentation at all, IPv6 uses ARP, IPv6 base header checksum, IPv4 has solicited-node multicast.

**Examples.**

1. `Router may fragment when permitted` → IPv4 only. L1.
2. `Source can fragment using a fragmentation header/mechanism` → both. L2.
3. `Neighbor resolution message must arrive with Hop Limit255` → IPv6 ND profile. L3.

**Validation/coverage.** Curated rule matrix tied to model references; every rule gets positive and contrast cases.

### Cross-family progression

Header reading and route selection precede routed transformations. TTL traces are introduced before ICMP traceroute. Fragment planning precedes reassembly. IPv6 chains should follow basic IPv6 forwarding, and contrast questions should diagnose rather than introduce rules.

## 6. Category: ICMP, MTU, and path behavior

### Category purpose

Train interpretation of control/error messages and the packet-size limits that produce them.

### Learn

ICMP reports conditions about IP delivery and supports diagnostics. It is part of IP operation, not merely “ping.” A path MTU is the smallest MTU on the route. IPv4 may fragment when permitted; IPv6 routers instead return Packet Too Big so the source can reduce packet size. TCP MSS describes TCP payload per segment, not full frame or IP packet size.

### Prerequisites

Category 5.

### Subcategories

1. Message selection
2. Echo and traceroute
3. Path MTU and MSS
4. Encapsulation budgets

### Family `icmp_message_select`

**Task and relationship.** Select the applicable ICMPv4/ICMPv6 message from a precise forwarding outcome.

**Response and template.** Type label and recipient. `{device} encounters {condition}. What message, if any, is returned to whom?`

**Generation and derivation.** Apply profile table: expired limit→Time Exceeded; no route/administrative/port condition→declared unreachable code; oversized IPv6→Packet Too Big; echo request→echo reply.

**Constraints.** The originating packet is eligible for an error; suppress-error corner cases are excluded or explicitly taught.

**Difficulty.** L1 echo/expiry; L2 no route/closed UDP port; L3 IPv4 DF versus IPv6 PTB; L4 choose no error under a stated suppression rule.

**Misconceptions/distractors.** TCP reset for every failure, ARP reply as route error, ICMP always sent by destination, PTB sent onward to receiver.

**Examples.**

1. router decrements TTL1 to0 → ICMP Time Exceeded to source. L1.
2. destination receives UDP to a closed port under fixture policy → destination unreachable/port unreachable. L2.
3. IPv6 router sees 1400-byte packet on MTU1280 → discard and ICMPv6 Packet Too Big with1280. L2.

**Validation/coverage.** Condition/message decision table and source/destination role checks.

### Family `ping_timeline`

**Task and relationship.** Trace echo identifiers/sequences, limits, and round-trip observations through a synthetic path.

**Response and template.** Ordered packet events and derived loss/RTT. `Given echo probes {events}, complete the ping summary.`

**Generation and derivation.** Pair replies by identifier/sequence; RTT=reply arrival−request send; loss from sent minus paired replies; returned TTL/Hop Limit is independently path-decremented.

**Constraints.** All clocks use one displayed time base; no duplicate ambiguity unless deliberately labeled.

**Difficulty.** L1 one pair; L2 several/loss; L3 reordered replies; L4 unrelated ICMP traffic and path asymmetry explicitly shown.

**Misconceptions/distractors.** Pair by arrival order, halve RTT, infer one-way path exactly from TTL, count time-exceeded as echo reply.

**Examples.**

1. seq1 sent0 ms, reply12 ms → RTT12 ms. L1.
2. seq1/2/3 sent, replies for1 and3 → 3 sent,2 received,33.3% loss. L2.
3. replies arrive seq2 then1 → pair by sequence, not order. L2.

**Validation/coverage.** Event pairing oracle; exact rational percentage internally with display rounding declared.

### Family `traceroute_hop_trace`

**Task and relationship.** Derive which router responds to increasing-limit probes and how the destination terminates the trace.

**Response and template.** Hop table. `Send probes with limits {limits} along {path}; fill each result.`

**Generation and derivation.** Limit `n` expires at router n when path has that hop; probes reaching destination produce the profile's terminal response.

**Constraints.** Probe method (ICMP echo, UDP, or TCP) and destination behavior are stated. Load balancing and missing replies appear only as explicit events.

**Difficulty.** L1 one probe per hop; L2 terminal distinction; L3 timeout row; L4 changed path per declared probe.

**Misconceptions/distractors.** Router n sees starting TTL unchanged, destination returns Time Exceeded, timeout proves no router exists.

**Examples.**

1. path R1,R2,D; TTL1 → R1 Time Exceeded. L1.
2. TTL2 → R2; TTL3 UDP probe reaches closed destination port → D port unreachable, trace complete. L2.
3. no reply at hop2 but hop3 replies → hop2 is unknown, not necessarily absent. L3.

**Validation/coverage.** Reuse TTL simulator plus terminal-response policy.

### Family `pmtu_mss_calculate`

**Task and relationship.** Find path MTU and maximum TCP payload per segment under declared headers.

**Response and template.** Bytes. `Path link MTUs are {mtus}; with {ip_header} and {tcp_header}, find PMTU and MSS.`

**Generation and derivation.** PMTU=min link MTUs; MSS=PMTU−IP header−TCP header−other explicitly included per-packet IP/transport overhead.

**Constraints.** Positive MSS; no offload; TCP options absent unless their length is supplied. Ethernet header is not subtracted from IP MTU.

**Difficulty.** L1 one MTU; L2 path minimum; L3 IPv4/IPv6 contrast; L4 options/tunnel overhead.

**Misconceptions/distractors.** Use maximum link MTU, subtract Ethernet header, confuse MSS with IP payload including TCP header.

**Examples.**

1. IPv4 MTU1500, IP20, TCP20 → MSS1460. L1.
2. IPv6 path1500/1280/1500, base40, TCP20 → PMTU1280, MSS1220. L2.
3. IPv4 TCP header32 at PMTU1400 → MSS1348. L3.

**Validation/coverage.** Dimensional sum and reconstruct `headers+MSS=PMTU`.

### Family `mtu_tunnel_budget`

**Task and relationship.** Compute inner-packet budget after one declared encapsulation and identify whether fragmentation/PTB occurs.

**Response and template.** Maximum inner size and outcome. `Outer path MTU {mtu}; tunnel adds {headers}. Can inner packet {size} pass?`

**Generation and derivation.** Maximum inner packet=`outer PMTU−outer/tunnel overhead`; compare size; apply named IPv4 DF or IPv6 behavior.

**Constraints.** Every overhead byte is listed. No compression, variable encryption padding, or nested tunnels in v1.

**Difficulty.** L1 direct subtraction; L2 include UDP wrapper; L3 derive inner TCP MSS; L4 compare two tunnel profiles.

**Misconceptions/distractors.** Add overhead after MTU without consequence, subtract inner IP header twice, assume Ethernet MTU grows.

**Examples.**

1. PMTU1500, tunnel overhead50 → inner IP budget1450. L1.
2. inner1500 with same tunnel → exceeds by50; cannot pass unchanged. L2.
3. inner IPv6 packet1300, budget1280 → source must reduce/fragment according to shown source policy; router does not fragment. L3.

**Validation/coverage.** Conservation-of-bytes invariant; test exact-fit and one-byte-over boundaries.

### Cross-family progression

Teach message selection after TTL behavior, then use it in ping and traceroute. PMTU and MSS calculations follow packet-length work. Tunnel budgets are composition exercises and remain separate until base MTU reasoning is mastered.

## 7. Category: UDP and TCP transport

### Category purpose

Train endpoint demultiplexing and mental execution of reliable byte-stream state without pretending to implement all of TCP.

### Learn

UDP adds ports, length, and a checksum around independent datagrams. TCP establishes a byte stream identified by two endpoint pairs. Sequence numbers label bytes; acknowledgements name the next byte expected. SYN and FIN occupy sequence space. Cumulative acknowledgements, receive windows, and retransmission can be reasoned about from a small timeline even though real congestion control and timer selection are outside this app.

### Prerequisites

Categories 2 and 5.

### Subcategories

1. Ports, tuples, and UDP
2. TCP handshake
3. Sequence/acknowledgement arithmetic
4. Loss, windows, segmentation, and close

### Family `socket_tuple_identify`

**Task and relationship.** Identify flow direction, client/server endpoints, or whether two packets belong to one connection.

**Response and template.** Endpoint fields or yes/no. `Given packets {packets}, group them by transport flow/connection.`

**Generation and derivation.** Compare protocol and unordered endpoint pair for bidirectional connection identity; preserve direction for datagrams.

**Constraints.** No address reuse ambiguity over time; IPv6 addresses normalized before comparison.

**Difficulty.** L1 ports; L2 full 4-tuple; L3 same ports/different addresses; L4 NAT view explicitly separated.

**Misconceptions/distractors.** Destination port alone identifies connection, reversed reply is a new TCP connection, UDP and TCP port53 are same socket.

**Examples.**

1. TCP `A:50000→B:443` and `B:443→A:50000` → same connection. L1.
2. `C:50000→B:443` → different connection from A's. L2.
3. UDP `A:53→B:53` and TCP same endpoints → different protocol flows. L2.

**Validation/coverage.** Canonical connection key and directional datagram key.

### Family `udp_header_length`

**Task and relationship.** Parse or construct UDP ports, length, payload size, and checksum-field validity.

**Response and template.** Named fields. `Decode/complete UDP header {header} carrying {data}.`

**Generation and derivation.** Header is source port, destination port, length, checksum; payload=`length−8`. Encode all fields network order.

**Constraints.** Length 8–65535 and consistent with IP payload. IPv6 zero checksum rejected in ordinary model; IPv4 zero checksum recognized as “not provided” only in explicit profile.

**Difficulty.** L1 payload from length; L2 raw bytes; L3 nested IP/UDP lengths; L4 checksum rule comparison.

**Misconceptions/distractors.** Length excludes header, swap ports, interpret checksum zero identically in IPv4/IPv6.

**Examples.**

1. UDP Length40 → payload32 B. L1.
2. bytes `C3 50 00 35 00 14 ...` → source50000, destination53, length20. L2.
3. IPv6 UDP checksum `0000` → invalid in ordinary profile. L3.

**Validation/coverage.** Serialize/parse round trip and nested-length invariant.

### Family `transport_demultiplex`

**Task and relationship.** Determine which declared listener or connected socket receives a segment/datagram.

**Response and template.** Socket selection/status. `Host owns {addresses} and sockets {sockets}; deliver {packet}.`

**Generation and derivation.** Match IP protocol, local destination address/wildcard, local destination port, and connected peer fields when required.

**Constraints.** Socket precedence is fully declared; no reuse-port, IPv4-mapped IPv6, multicast fan-out, or OS-specific wildcard ambiguity.

**Difficulty.** L1 one listener; L2 protocol mismatch; L3 connected versus listening; L4 several nonconflicting local addresses.

**Misconceptions/distractors.** Match source port to listener, ignore protocol, assume route guarantees listener.

**Examples.**

1. UDP listener `0.0.0.0:53` receives UDP to local `.5:53`. L1.
2. TCP listener `:53` does not receive that UDP datagram. L1.
3. established TCP socket `A:50000↔B:443` receives only matching peer tuple, not C's SYN. L3.

**Validation/coverage.** Deterministic socket matcher; generate zero or exactly one receiver.

### Family `tcp_handshake_trace`

**Task and relationship.** Complete flags and sequence/acknowledgement numbers in a three-way handshake.

**Response and template.** Ordered segment table. `Client ISN {c_isn}, server ISN {s_isn}. Complete the handshake.`

**Generation and derivation.** Client SYN seq C; server SYN+ACK seq S ack C+1; client ACK seq C+1 ack S+1.

**Constraints.** No simultaneous open, SYN data, Fast Open, loss, or options except separately supplied MSS.

**Difficulty.** L1 flags/order; L2 exact numbers; L3 identify malformed ACK; L4 handshake retransmission with same sequence values.

**Misconceptions/distractors.** ACK equals peer ISN, pure ACK consumes one, choose new ISN on SYN retransmission.

**Examples.**

1. C1000,S5000 → `SYN seq1000`; `SYN-ACK seq5000 ack1001`; `ACK seq1001 ack5001`. L2.
2. server reply ack1000 → invalid acknowledgement of SYN. L2.
3. lost first SYN retransmitted → seq remains1000. L3.

**Validation/coverage.** TCP sequence transition model; include both endpoint perspectives.

### Family `tcp_sequence_ack`

**Task and relationship.** Calculate sequence ranges and the next cumulative acknowledgement after in-order data.

**Response and template.** Sequence interval and ACK. `Segment starts at seq {seq} and carries {length} data bytes with flags {flags}. What ACK is expected?`

**Generation and derivation.** Next=`seq+data length+SYN?1:0+FIN?1:0` modulo `2^32` only when labeled.

**Constraints.** No overlapping data in basic levels. Empty pure ACK advances nothing.

**Difficulty.** L1 data only; L2 SYN/FIN; L3 sequence derived from prior segment; L4 wraparound.

**Misconceptions/distractors.** ACK last byte rather than next, count TCP header, pure ACK consumes sequence, forget FIN.

**Examples.**

1. seq1001 with100 data bytes → ACK1101. L1.
2. FIN seq1101 with no data → ACK1102. L2.
3. pure ACK seq1102 no data → sender's next sequence remains1102. L2.

**Validation/coverage.** Byte-interval oracle and off-by-one boundary corpus.

### Family `tcp_out_of_order_ack`

**Task and relationship.** Update cumulative ACK and receive buffer as segments arrive out of order.

**Response and template.** Per-event ACK and buffered ranges. `Receiver next expects {rcv_nxt}; process {segments}.`

**Generation and derivation.** Buffer acceptable out-of-order ranges; ACK remains first missing byte; when gap fills, merge contiguous data and advance across it.

**Constraints.** Duplicate ACK counting is descriptive only; SACK absent. Overlaps are either exact duplicates or rejected from generation.

**Difficulty.** L1 one gap; L2 gap fill unlocks two segments; L3 duplicate; L4 reordered events with FIN.

**Misconceptions/distractors.** ACK highest byte seen, discard all out-of-order data, add lengths regardless of gap.

**Examples.**

1. expect100, receive200–299 → ACK100, buffer200–299. L2.
2. then receive100–199 → contiguous through299, ACK300. L2.
3. receive100–149 twice → first ACK150, duplicate leaves ACK150. L3.

**Validation/coverage.** Interval-union receive model; random arrival-order invariance after complete delivery.

### Family `tcp_retransmission_trace`

**Task and relationship.** Identify which bytes are retransmitted after a displayed timeout or duplicate-ACK rule.

**Response and template.** Segment/range choice and updated ACK. `Sender has {outstanding}; receiver events are {events}; what is retransmitted?`

**Generation and derivation.** Use an explicit simplified policy: timeout retransmits oldest unacknowledged segment; three duplicate ACKs trigger retransmission of the segment beginning at that ACK.

**Constraints.** Policy is printed; no congestion-window or RTO calculation. Avoid ambiguity from partial ACK unless explicitly modeled.

**Difficulty.** L1 timeout; L2 cumulative ACK removes earlier ranges; L3 fast retransmit; L4 spurious duplicate data recognition.

**Misconceptions/distractors.** Retransmit latest segment, ACK number identifies last received byte, retransmit acknowledged bytes.

**Examples.**

1. outstanding100–199 and200–299, timeout → retransmit100–199. L1.
2. ACK200 arrives, then timeout → retransmit200–299. L2.
3. three ACK100 duplicates while segment100–199 missing → retransmit100–199. L3.

**Validation/coverage.** Explicit sender queue/state oracle; do not infer real-stack timing.

### Family `tcp_receive_window`

**Task and relationship.** Determine whether/how much new data fits in a supplied receive window.

**Response and template.** Allowed byte interval/amount. `Receiver ACK is {ack}, advertised window {window}; sender proposes {segment}.`

**Generation and derivation.** Modeled acceptable new sequence interval is `[ACK, ACK+window)`; intersect proposed data, excluding already acknowledged bytes.

**Constraints.** No window scaling, zero-window probes, or wraparound except labeled advanced variants.

**Difficulty.** L1 exact fit; L2 partial fit; L3 old duplicate plus new suffix; L4 window update over timeline.

**Misconceptions/distractors.** Window is total connection bytes, inclusive upper endpoint, measured from proposed segment start.

**Examples.**

1. ACK1000, window500 → new bytes1000–1499 accepted. L1.
2. segment1400–1599 → 1400–1499 fits,100 B new. L2.
3. segment900–1099 → 1000–1099 is new/in-window,100 B. L3.

**Validation/coverage.** Half-open interval arithmetic and exact-boundary tests.

### Family `tcp_mss_segment_plan`

**Task and relationship.** Divide application data into TCP payload segments and assign sequence numbers.

**Response and template.** Ordered segment table. `Starting sequence {seq}, send {bytes} B with MSS {mss}.`

**Generation and derivation.** Emit `floor/remaining` chunks no larger than MSS; each next sequence advances by prior payload length.

**Constraints.** Handshake complete; no coalescing, delayed sends, TLS record alignment, or retransmission.

**Difficulty.** L1 exact multiple; L2 remainder; L3 account for starting sequence after SYN; L4 combine receive-window cap.

**Misconceptions/distractors.** MSS includes TCP/IP headers, every segment full, increment by MSS after short final.

**Examples.**

1. 2920 B, MSS1460, seq1001 → two segments at1001 and2461, each1460. L1.
2. 3000 B → 1460,1460,80 at seq1001,2461,3921. L2.
3. window2000 permits first1460 then540 before an update under stated send rule. L3.

**Validation/coverage.** Concatenated ranges exactly cover requested bytes without overlap/gap.

### Family `tcp_close_state`

**Task and relationship.** Trace sequence numbers and endpoint states through a simple orderly close or reset.

**Response and template.** Ordered flags/numbers and simplified states. `Starting ESTABLISHED with {seq_state}, process {close_events}.`

**Generation and derivation.** FIN consumes one; peer ACKs next sequence; independent half-close allows remaining direction; second FIN/ACK closes under displayed simplified state names.

**Constraints.** Use a pedagogical subset of `ESTABLISHED`, `FIN-WAIT`, `CLOSE-WAIT`, `LAST-ACK`, `TIME-WAIT`, `CLOSED`; timers are stated. No simultaneous close initially.

**Difficulty.** L1 flags/order; L2 numbers; L3 half-close; L4 reset contrast or simultaneous close extension.

**Misconceptions/distractors.** One FIN closes both directions immediately, FIN consumes zero, ACK itself consumes one.

**Examples.**

1. A FIN seq500 → B ACK501; B may still send until its FIN. L2.
2. B FIN seq900 → A ACK901. L2.
3. RST under declared valid condition terminates immediately without FIN handshake. L3.

**Validation/coverage.** Simplified TCP state machine and sequence invariants.

### Cross-family progression

Tuple identity and UDP establish demultiplexing. TCP handshake precedes general sequence arithmetic. In-order ACKs precede out-of-order buffering and retransmission. Windows and MSS are separate constraints before being composed. Teardown comes last because it reuses sequence-space rules.

## 8. Category: DNS, DHCP, and host configuration

### Category purpose

Train protocol exchanges that turn a newly attached host into one able to address and name peers.

### Learn

DHCPv4 supplies a lease and configuration through a client/server exchange, possibly via a relay. DNS maps typed names and data; a recursive resolver may perform several iterative queries and cache each answer for a bounded TTL. DNS commonly uses UDP, but TCP is a normal supported transport and may be used or required by the displayed policy.

### Prerequisites

UDP/TCP basics, routing, broadcast.

### Category boundaries

Static vocabulary-only port-number recall is not a family. DNSSEC, dynamic updates, DHCPv6, and real resolver behavior are excluded.

### Subcategories

1. DNS records and resolution
2. DNS cache and transport
3. DHCPv4 exchange and relay

### Family `dns_record_select`

**Task and relationship.** Select or construct the record type that expresses a described mapping.

**Response and template.** Record type and RDATA fields. `Which DNS record expresses {relationship}?`

**Generation and derivation.** Use A, AAAA, CNAME, MX, NS, PTR, and TXT under a supplied zone; apply type-specific fields such as MX preference.

**Constraints.** Names are absolute `.test` names in feedback; no CNAME at an owner with conflicting modeled data.

**Difficulty.** L1 A/AAAA; L2 alias/mail/name server; L3 reverse pointer or compare owner versus target; L4 choose records for a small zone.

**Misconceptions/distractors.** A stores a hostname, CNAME maps directly to IP, MX preference means highest wins, PTR reverses arbitrary text.

**Examples.**

1. `api.example.test→192.0.2.8` → A. L1.
2. `www` aliases `app.example.test` → CNAME. L2.
3. mail exchangers priority10 and20 → preference10 tried first. L2.

**Validation/coverage.** Typed record schema and unique-choice checks.

### Family `dns_recursive_iterative_trace`

**Task and relationship.** Order stub, recursive, root, TLD, authoritative, and response messages in a bounded lookup.

**Response and template.** Ordered sequence. `With empty caches and delegation graph {graph}, trace resolution of {query}.`

**Generation and derivation.** Stub asks recursive resolver; resolver follows referrals from root toward authoritative server, obtains answer, and returns it.

**Constraints.** Glue records and referral targets are explicitly supplied; no DNSSEC, QNAME minimization, parallelism, or search suffix.

**Difficulty.** L1 recursive already cached; L2 one referral; L3 root/TLD/authority; L4 CNAME crossing a second zone.

**Misconceptions/distractors.** Stub directly asks every server, root knows final address, authoritative server recursively queries by default.

**Examples.**

1. recursive cache contains valid A → stub request, immediate recursive response. L1.
2. empty: recursive→root referral→`.test` authority→answer→stub. L3.
3. authority returns CNAME in another zone → resolver continues for target before final response. L4.

**Validation/coverage.** Delegation graph traversal with role-labeled events.

### Family `dns_cache_ttl`

**Task and relationship.** Determine cache contents and remaining lifetimes after timed queries/responses.

**Response and template.** Cache table and query/no-query decisions. `Starting at t={time}, process {dns_events}.`

**Generation and derivation.** Entry expires at insertion time plus TTL; remaining=`max(0, expiry−now)`; each record in an alias chain has its own expiry.

**Constraints.** Clock order explicit; negative caching only in a separately specified variant with supplied TTL.

**Difficulty.** L1 one hit/expiry; L2 several TTLs; L3 CNAME target expires first; L4 cache replacement.

**Misconceptions/distractors.** TTL refreshes on every read, all chain entries share one TTL, zero remaining is still usable.

**Examples.**

1. cached at t0 TTL300, query t120 → hit,180 s remain. L1.
2. query t300 → expired; new upstream query required. L2.
3. CNAME TTL600 but target A TTL60; at t90 alias remains but A must be re-queried. L3.

**Validation/coverage.** Absolute-expiry event model and boundary at exactly expiry.

### Family `dns_message_transport`

**Task and relationship.** Select UDP or TCP action from message state and declared resolver policy.

**Response and template.** Transport and next message. `Resolver sends {query}; response has {flags/size}. What happens next under {policy}?`

**Generation and derivation.** Apply explicit initial transport; a UDP response with TC set leads to TCP retry in the teaching profile; TCP frames DNS messages with a two-byte length.

**Constraints.** Do not teach UDP-first as universal: current DNS supports TCP as a normal transport. Do not infer truncation from size without displayed policy.

**Difficulty.** L1 declared UDP/TCP; L2 TC retry; L3 TCP length prefix; L4 connection reuse for several queries.

**Misconceptions/distractors.** DNS only UDP, TCP only zone transfer, TC means corrupt response, TCP preserves datagram boundaries without DNS length.

**Examples.**

1. UDP response `TC=1` under retry profile → repeat query over TCP. L2.
2. DNS message 300 B over TCP → two-byte length prefix `01 2C`. L2.
3. open DNS/TCP connection and policy permits reuse → next query can use same connection. L3.

**Validation/coverage.** Transport-policy state machine and 16-bit length encoding.

### Family `dhcp_dora_trace`

**Task and relationship.** Complete DHCPDISCOVER/OFFER/REQUEST/ACK roles, selected address, and configuration.

**Response and template.** Ordered message table. `Client with no address interacts with {servers}. Complete the DHCPv4 exchange.`

**Generation and derivation.** Client discovers; server(s) offer; client requests one offer naming selection; selected server acknowledges and lease/config becomes active.

**Constraints.** Broadcast/unicast mode is shown; one accepted offer; transaction identifier matches. Decline/NAK/renewal excluded at early levels.

**Difficulty.** L1 names/order; L2 addresses/options; L3 multiple offers; L4 detect wrong transaction/server/address.

**Misconceptions/distractors.** ACK before request, all offers become leases, DHCP configures routers themselves, client can use offered address before modeled ACK.

**Examples.**

1. `DISCOVER→OFFER→REQUEST→ACK`. L1.
2. offers `.20` from S1 and `.30` from S2; REQUEST names S2/.30 → ACK from S2 activates `.30`. L3.
3. ACK has different transaction ID → ignore under fixture rules. L3.

**Validation/coverage.** DHCP transaction state machine and unique selected lease.

### Family `dhcp_relay_lease`

**Task and relationship.** Trace a DHCP request across a relay and calculate lease renewal/expiry decisions.

**Response and template.** Ordered nodes/addresses plus lease status. `Client subnet {subnet} uses relay {relay}; process {messages/times}.`

**Generation and derivation.** Relay receives local client message, sets/display relay information such as `giaddr`, unicasts/forwards to server; server chooses matching pool and returns via relay. Lease validity follows displayed T1/T2/expiry.

**Constraints.** One relay, one server, explicit pool mapping. Timers use exact timestamps; no failover.

**Difficulty.** L1 relay path; L2 pool choice; L3 T1 renewal; L4 rebinding/expiry.

**Misconceptions/distractors.** Routers forward limited broadcast unchanged, server selects pool from client source `0.0.0.0`, address remains usable after expiry.

**Examples.**

1. relay `192.0.2.1` forwards request to server → server selects `192.0.2.0/24` pool. L2.
2. lease3600 s, T1=1800; at t1700 no renewal required, at1800 begin renewal. L2.
3. no ACK by expiry t3600 → client stops using address. L3.

**Validation/coverage.** Relay/pool lookup plus lease event simulator.

### Cross-family progression

Record meaning precedes recursive traces. Cache lifetimes and transport behavior are orthogonal and should be interleaved only after direct lookups. DHCP message order precedes relay and lease timers. End-to-end startup exercises may later combine DHCP configuration, ARP/ND, routing, and DNS.

## 9. Category: HTTP, TLS, and QUIC

### Category purpose

Train recognition of how application messages are framed and how modern secure transports relate, without turning the app into a browser or cryptography implementation.

### Learn

HTTP defines request/response semantics; HTTP/1.1 also defines textual message framing over a byte stream. TLS establishes parameters, authenticates the server under the shown trust model, and protects subsequent records. HTTP/2 multiplexes streams over one TCP connection. QUIC runs over UDP, integrates TLS 1.3, and exposes independent streams; HTTP/3 maps HTTP to QUIC.

### Prerequisites

Category 7 and basic DNS.

### Category boundaries

No real HTTP requests, certificate stores, encryption, compression bitstreams, or implementation fingerprinting. Practical cryptography owns primitive mechanics.

### Subcategories

1. HTTP/1.1 parsing and framing
2. Connection and stream multiplexing
3. TLS roles
4. QUIC comparison

### Family `http_request_parse`

**Task and relationship.** Extract method, request target, version, Host, and declared body framing from an HTTP/1.1 request.

**Response and template.** Named fields. `Parse this HTTP/1.1 request: {request_bytes}.`

**Generation and derivation.** Split start-line and CRLF-delimited fields; parse controlled field grammar; body begins after empty line and uses the chosen valid framing.

**Constraints.** ASCII fixtures; valid CRLF; no obsolete folding, whitespace ambiguity, conflicting framing, or request smuggling cases.

**Difficulty.** L1 GET; L2 query/Host/port; L3 body with Content-Length; L4 find a single declared syntax error.

**Misconceptions/distractors.** Fragment sent in request target, Host is TCP destination necessarily, Content-Length counts characters rather than bytes.

**Examples.**

1. `GET /health HTTP/1.1\r\nHost: app.test\r\n\r\n` → method GET, target `/health`, no body. L1.
2. `GET /q?a=1 ...` → query remains in request target. L2.
3. `POST /x ... Content-Length: 4 ... \r\n\r\nDATA` → four body bytes. L2.

**Validation/coverage.** Restricted grammar parser and parse/serialize round trip.

### Family `http_response_framing`

**Task and relationship.** Determine where an HTTP/1.1 response body ends under a supplied valid framing mode.

**Response and template.** Byte range/length and next-message offset. `Given stream bytes {stream}, frame the first response.`

**Generation and derivation.** Apply status/method no-body cases, valid Content-Length, or chunked coding; parse chunk sizes as hex and stop at zero chunk plus trailers terminator.

**Constraints.** Exactly one framing rule applies; close-delimited messages are separately labeled; no conflicting Content-Length/Transfer-Encoding.

**Difficulty.** L1 Content-Length; L2 two responses on persistent stream; L3 chunks; L4 HEAD/204 no-body rule.

**Misconceptions/distractors.** Read until TCP segment ends, chunk size decimal, include chunk metadata as representation data, give 204 a body from Content-Length.

**Examples.**

1. Content-Length5 then `HELLO` → body5 B. L1.
2. chunks `4\r\nWiki\r\n0\r\n\r\n` → body `Wiki`,4 B. L3.
3. status204 → no message body under profile even if a misleading following response exists. L3.

**Validation/coverage.** Byte-stream framer and concatenated-message property tests.

### Family `http_connection_reuse`

**Task and relationship.** Place requests/responses on one or several HTTP/1.1 connections under displayed persistence rules.

**Response and template.** Connection assignment/timeline. `Client has {connections}; schedule {requests} under {rules}.`

**Generation and derivation.** Reuse an open persistent connection when allowed; responses on a basic non-pipelined connection follow request order; `Connection: close` ends after response.

**Constraints.** No browser connection-limit folklore, retry semantics, or pipelining unless explicitly declared.

**Difficulty.** L1 reuse; L2 close; L3 two connections; L4 compare serial HTTP/1.1 with HTTP/2 streams.

**Misconceptions/distractors.** Every request requires TCP handshake, one TCP segment equals one response, close header terminates before response body.

**Examples.**

1. two sequential requests, persistent connection open → one TCP connection. L1.
2. first response says `Connection: close` → second needs another connection. L2.
3. two HTTP/1.1 connections may progress independently under displayed schedule. L3.

**Validation/coverage.** Connection lifecycle simulator independent of TCP packetization.

### Family `http2_stream_multiplex`

**Task and relationship.** Reconstruct per-stream messages from interleaved conceptual HTTP/2 frames.

**Response and template.** Group/order by stream ID. `Frames arrive {frames}; reconstruct each stream.`

**Generation and derivation.** Frames with the same nonzero stream ID belong to that stream; preserve within-stream order; interleaving does not mix payload between streams.

**Constraints.** Conceptual HEADERS/DATA/END_STREAM only; no HPACK, dependency tree, flow-control arithmetic, continuation constraints, or wire preface.

**Difficulty.** L1 two streams; L2 multiple DATA frames; L3 connection-control frame stream0; L4 contrast TCP loss effect with application stream grouping.

**Misconceptions/distractors.** Arrival adjacency determines message, stream IDs are ports, stream0 is a normal request.

**Examples.**

1. DATA stream1 `A`, stream3 `X`, stream1 `B` → stream1 `AB`, stream3 `X`. L2.
2. END_STREAM on stream3 closes only stream3. L2.
3. SETTINGS stream0 belongs to connection control, not request stream. L3.

**Validation/coverage.** Per-stream event reducer and uniqueness of stream ownership.

### Family `tls13_handshake_roles`

**Task and relationship.** Order the bounded TLS 1.3 handshake and identify what becomes protected/authenticated when.

**Response and template.** Ordered messages plus guarantee labels. `Order {TLS_messages} and mark {properties}.`

**Generation and derivation.** Use pinned full-handshake skeleton: ClientHello; ServerHello; encrypted server handshake messages including EncryptedExtensions, Certificate, CertificateVerify, Finished; client Finished; application data. Details omitted by profile are not inferred.

**Constraints.** No 0-RTT, HelloRetryRequest, client authentication, PSK, or resumption in initial family. Use RFC 9846 profile metadata.

**Difficulty.** L1 roles/order; L2 negotiation versus authentication; L3 first protected phase; L4 compare omitted 0-RTT only conceptually.

**Misconceptions/distractors.** Certificate encrypts all traffic itself, ServerHello authenticates hostname alone, HTTP precedes Finished in basic profile.

**Examples.**

1. ClientHello is sent by client and offers parameters. L1.
2. Certificate identifies/authenticates server subject under validation model; it is not the symmetric traffic key. L2.
3. application data follows successful Finished messages in the basic profile. L2.

**Validation/coverage.** Versioned handshake DAG rather than arbitrary text ordering.

### Family `tls_sni_alpn_certificate`

**Task and relationship.** Determine server name selection, negotiated application protocol, and certificate identity result from controlled inputs.

**Response and template.** Selected virtual host, ALPN, and pass/fail reason. `Client offers {sni,alpn}; server has {configs/cert}; decide the result.`

**Generation and derivation.** SNI selects matching server configuration; ALPN chooses a server-supported item from client offers under displayed priority; certificate validation checks displayed trust, time, and hostname rules.

**Constraints.** Hostname matching grammar is explicitly bounded; no public trust store, revocation, IDNA, or wildcard edge cases beyond declared single-label rule.

**Difficulty.** L1 exact name/protocol; L2 preference intersection; L3 expired/untrusted/name mismatch; L4 distinguish successful TLS from HTTP routing.

**Misconceptions/distractors.** SNI is encrypted in all profiles without qualification, ALPN is a port, valid signature alone proves hostname, certificate chooses URL path.

**Examples.**

1. SNI `api.test` selects `api.test` virtual host. L1.
2. client offers `[h2,http/1.1]`, server supports `[http/1.1]` → `http/1.1`. L2.
3. trusted cert for `www.test` used with `api.test` → hostname validation fails. L2.

**Validation/coverage.** Set/priority oracle and bounded certificate predicate.

### Family `quic_transport_compare`

**Task and relationship.** Compare TCP+TLS+HTTP/2 with QUIC+TLS+HTTP/3 and trace connection/stream identity.

**Response and template.** Matching or state choice. `For {event/property}, choose the applicable stack and consequence.`

**Generation and derivation.** QUIC runs over UDP, carries integrated TLS handshake, uses connection IDs, and multiplexes streams; a displayed path change may preserve connection when CID/validation conditions are satisfied.

**Constraints.** No packet-number decoding, cryptographic header protection, congestion-control arithmetic, or unconditional claims about performance.

**Difficulty.** L1 stack order; L2 stream independence; L3 connection ID/path change; L4 reason about loss without claiming QUIC eliminates all blocking.

**Misconceptions/distractors.** QUIC is TCP over UDP, HTTP/3 uses TCP, every UDP tuple change necessarily starts a new QUIC connection, QUIC prevents all delay from loss.

**Examples.**

1. HTTP/3 → HTTP/3 over QUIC over UDP over IP. L1.
2. QUIC stream4 ending does not end stream8. L2.
3. client address changes but valid CID and path validation succeed → modeled connection continues. L3.

**Validation/coverage.** Curated architecture/state matrix; wording review forbids performance absolutes.

### Cross-family progression

HTTP/1.1 parsing and framing precede persistence. HTTP/2 follows only as a conceptual contrast. TLS roles precede certificate/negotiation diagnosis. QUIC is last because it reuses UDP, TLS, and multiplexing concepts.

## 10. Category: NAT, firewalls, and connection state

### Category purpose

Train table-driven reasoning about address translation and traffic policy while separating connectivity from security.

### Learn

NAT rewrites named address/port fields according to a mapping. PAT allows many internal flows to share one external address by allocating distinct ports. A stateful firewall remembers a modeled connection and can admit corresponding return traffic. Rule order and processing order matter and vary between products, so every exercise uses the explicit `packet-policy-v1` pipeline rather than pretending there is one universal platform order.

### Pinned policy pipeline

For routed inbound packets:

1. validate and associate an existing translation when applicable;
2. apply declared destination translation;
3. make route decision on the translated destination;
4. apply the labeled stateful/filter rule table;
5. emit with required source translation if a rule requests it.

For outbound packets, route/filter/source-translation stages appear in the diagram with the same labels. Exercises may ask a different order only when the complete alternative pipeline is printed. Answers are about the given model, not Linux, BSD, or a firewall appliance.

### Prerequisites

Routing and transport tuples.

### Category boundaries

No vendor syntax, application-layer gateway, NAT traversal protocol, carrier-grade NAT operations, IPv6 transition mechanism, or adversarial firewall bypass.

### Subcategories

1. Source and destination translation
2. Connection tracking
3. Ordered policy rules
4. IPv6/security distinctions

### Family `nat_source_mapping`

**Task and relationship.** Allocate or reuse a source NAT/PAT mapping and construct the outbound tuple.

**Response and template.** Mapping row and translated packet. `NAT has {table/pool}; outbound flow is {tuple}. What leaves externally?`

**Generation and derivation.** Reuse exact active mapping; otherwise select the explicitly next/free external port; replace source address/port and record internal/remote tuple as defined.

**Constraints.** Allocation policy deterministic and shown; no collision; protocol is part of key.

**Difficulty.** L1 one static source NAT; L2 PAT allocation; L3 two internal hosts same source port; L4 reuse/expiry.

**Misconceptions/distractors.** Rewrite destination, external port must equal internal, TCP/UDP mappings collide, create mapping for every packet.

**Examples.**

1. `10.0.0.5:50000→198.51.100.8:443`, mapping external `203.0.113.9:40001` → outbound source becomes that. L1.
2. second internal host also uses50000 → gets different free external port40002. L2.
3. later packet same active flow → reuse40001. L2.

**Validation/coverage.** Bidirectional table uniqueness and deterministic allocator.

### Family `nat_return_lookup`

**Task and relationship.** Reverse a valid NAT mapping for return traffic or decide there is no target.

**Response and template.** Internal tuple/drop. `Inbound packet {tuple} reaches NAT with {table}.`

**Generation and derivation.** Match protocol, external destination address/port, and any remote endpoint fields required by profile; restore internal destination address/port.

**Constraints.** Exactly zero or one match; no endpoint-independent/dependent ambiguity because mapping key is printed.

**Difficulty.** L1 one row; L2 several ports; L3 TCP/UDP same number; L4 expired mapping or remote mismatch.

**Misconceptions/distractors.** Look up inbound source port, reverse any row with same address, deliver after expiry.

**Examples.**

1. reply to `203.0.113.9:40001` TCP → destination restored `10.0.0.5:50000`. L1.
2. UDP packet to40001 does not match TCP row. L2.
3. mapping expired before arrival → no translation target under model. L3.

**Validation/coverage.** Forward then reverse round trip for active mappings.

### Family `port_forward_trace`

**Task and relationship.** Apply destination NAT/port forwarding and route the translated packet to an internal service.

**Response and template.** Before/after tuple and next hop. `Inbound {packet} matches {port_forwards}; trace it.`

**Generation and derivation.** Match external destination/protocol/port, rewrite to configured internal destination/port, then route using post-translation address.

**Constraints.** Rule match is unique; listener/firewall result is asked only if corresponding state is shown.

**Difficulty.** L1 static mapping; L2 port changes; L3 wrong protocol/nonmatch; L4 combine return SNAT state.

**Misconceptions/distractors.** Rewrite source, route before translation despite model, port forward guarantees listener accepts.

**Examples.**

1. external TCP8443→`10.0.0.8:443`; inbound packet becomes destination `.8:443`. L1.
2. UDP8443 does not match TCP rule. L2.
3. translated route sends `.8` via LAN; public address route is no longer relevant. L3.

**Validation/coverage.** Pipeline stage snapshots and reversible connection mapping.

### Family `stateful_firewall_flow`

**Task and relationship.** Update a simplified connection tracker and decide whether forward/return packets are admitted.

**Response and template.** State plus allow/drop. `Firewall policy is {policy}; process {packet_sequence}.`

**Generation and derivation.** New flow must match a NEW rule; accepted TCP handshake advances simplified state; reverse packets matching accepted state are ESTABLISHED; expiry/removal ends that permission.

**Constraints.** State names and transition subset declared; no invalid-TCP evasion, helpers, zones, or asymmetric routing.

**Difficulty.** L1 new/return; L2 wrong tuple; L3 timeout; L4 NAT-adjusted tuple view labeled by pipeline stage.

**Misconceptions/distractors.** Stateful means allow all, source port alone is state, any ACK is established, expired flow remains permitted.

**Examples.**

1. outbound NEW TCP443 allowed; matching SYN-ACK return is ESTABLISHED and allowed. L2.
2. unrelated inbound SYN to internal host is NEW and hits default drop. L2.
3. matching-looking return after state expiry → NEW/no matching inbound allow, dropped. L3.

**Validation/coverage.** Simplified transport-aware connection state machine.

### Family `acl_first_match`

**Task and relationship.** Evaluate an ordered rule list against packet fields.

**Response and template.** First matching rule and action. `Apply rules top to bottom to {packet}.`

**Generation and derivation.** Test protocol, prefixes, ports, direction, interface, and state predicates in order; stop at first match; use explicit default.

**Constraints.** Every field semantics and inclusive port range shown. Rules intentionally shadow only when that is the skill.

**Difficulty.** L1 one criterion; L2 prefix/port; L3 shadowing; L4 state and translated-stage address.

**Misconceptions/distractors.** Most specific rule wins like routing, last match wins, evaluate against pre-NAT address when stage says post-NAT.

**Examples.**

1. `allow TCP dport443`, then `drop all`; TCP443 → first rule allow. L1.
2. `drop src 192.0.2.0/24` before `allow TCP443`; matching source TCP443 → drop. L2.
3. broad allow before narrow drop makes narrow rule unreachable for those packets. L3.

**Validation/coverage.** Predicate evaluator plus shadow-analysis metadata; distribute each rule position.

### Family `firewall_nat_pipeline`

**Task and relationship.** Trace the tuple and policy decision through every labeled NAT/firewall stage.

**Response and template.** Stage table. `Using pipeline {pipeline}, process {packet} through {rules/tables}.`

**Generation and derivation.** Apply each pure stage in stated order, recording tuple before/after and first terminating decision.

**Constraints.** At most five stages and one translation each direction. Never imply order is universal.

**Difficulty.** L1 one translation then allow; L2 rule sees translated address; L3 return path; L4 compare two printed pipelines.

**Misconceptions/distractors.** Rules always see public address, route never changes after DNAT, reverse translation is a new arbitrary rule.

**Examples.**

1. DNAT public8443→`.8:443`; post-DNAT rule matching `.8:443` allows. L2.
2. pre-DNAT filter for public8443 can match before rewrite in an explicitly alternative pipeline. L3.
3. return `.8:443→client` uses established reverse mapping to public8443. L3.

**Validation/coverage.** Functional stage composition and inverse-flow properties.

### Family `nat_address_family_reason`

**Task and relationship.** Distinguish address conservation, reachability, filtering, and IPv6 behavior.

**Response and template.** Single/multiple choice. `Which conclusion follows from {configuration}?`

**Generation and derivation.** Use only explicit facts: NAT may translate; firewall rules decide policy; global IPv6 addressing does not itself imply inbound reachability or permission.

**Constraints.** Conceptual reasoning, no claim that NAT is inherently a security control or that IPv6 never uses translation.

**Difficulty.** L1 NAT versus firewall role; L2 public/private reachability; L3 dual stack; L4 diagnose policy separately per family.

**Misconceptions/distractors.** NAT equals firewall, IPv6 needs NAT for security, global address guarantees open service, lack of NAT means no state.

**Examples.**

1. Removing NAT does not by itself create an allow rule. L1.
2. IPv6 global address plus default-drop firewall → unsolicited inbound remains blocked. L2.
3. IPv4 service works through port forward while IPv6 fails → inspect IPv6 route/listener/firewall independently. L3.

**Validation/coverage.** Curated implication table reviewed for precise nonabsolute wording.

### Cross-family progression

Teach forward source translation and reverse lookup as a pair. Destination forwarding follows. Stateful policy and ordered ACLs should be understood independently before pipeline composition. The address-family family is diagnostic and should follow concrete table reasoning.

## 11. Category: Packet analysis and diagnosis

### Category purpose

Integrate earlier skills into bounded evidence-based interpretation: decode a synthetic capture, reconstruct a flow, and identify the earliest contradicted dependency.

### Learn

A packet trace is a set of observations, not omniscience. Diagnose only what the capture point and supplied device state can establish. Work from lower prerequisites upward:

1. link and VLAN;
2. local resolution;
3. address and route;
4. transport exchange;
5. name/configuration protocol;
6. TLS and application.

Repeated packets may be retransmissions, duplicates, or separate attempts; identifiers, tuples, sequence numbers, and timing distinguish them.

### Prerequisites

All earlier categories, although introductory decodes may unlock after Category 5.

### Category boundaries

All captures are synthetic. The app does not open uploaded PCAPs in v1, capture live traffic, or prescribe real-world invasive tests.

### Subcategories

1. Packet decode
2. Flow reconstruction
3. Layered fault isolation
4. Safe observations

### Family `packet_capture_layer_decode`

**Task and relationship.** Decode the relevant fields of one compact synthetic packet and summarize its likely protocol role.

**Response and template.** Layer tree plus named fields. `At capture point {point}, decode packet {bytes}.`

**Generation and derivation.** Use the same serializers/parsers as family generators; follow discriminators and validate nested lengths/checksums when supplied.

**Constraints.** At most 96 bytes displayed, with omitted payload clearly marked. Unknown/encrypted payload is labeled opaque rather than guessed.

**Difficulty.** L1 annotated; L2 raw Ethernet+IP+UDP/TCP; L3 VLAN/IPv6 extension; L4 identify malformed nested length.

**Misconceptions/distractors.** Infer application from port alone, parse ciphertext as HTTP, overlook VLAN/extension offset, mistake capture length for original length.

**Examples.**

1. EtherType0806, ARP op1 → ARP request; extract sender/target. L2.
2. IPv4 protocol6, TCP flags SYN, ACK clear → connection-opening attempt. L2.
3. TCP443 payload after established TLS → opaque TLS record, not readable HTTP. L3.

**Validation/coverage.** Round-trip packet corpus and independent fixture snapshots.

### Family `flow_timeline_order`

**Task and relationship.** Reconstruct a protocol exchange from shuffled capture rows.

**Response and template.** Ordered packet IDs with phase labels. `Order {capture_rows} into the exchange.`

**Generation and derivation.** Order by causal constraints—ARP/ND before dependent unicast, SYN before SYN-ACK, query before matching response—using IDs/sequence values; timestamps break remaining ties.

**Constraints.** Exactly one causal order after stated same-time rule. Capture-point omissions are declared.

**Difficulty.** L1 timestamps/order; L2 shuffled handshake; L3 resolution plus transport; L4 simultaneous independent flows separated by tuple.

**Misconceptions/distractors.** Sort by source address, pair different transaction IDs, place data before handshake, assume every capture sees both directions.

**Examples.**

1. TCP SYN, SYN-ACK acking it, final ACK → that order. L1.
2. ARP request/reply precedes queued IPv4 SYN. L2.
3. two DNS replies are paired to queries by transaction/name/type, not adjacency. L3.

**Validation/coverage.** Generate forward event DAG, shuffle, require unique topological order for asked subset.

### Family `first_failed_layer`

**Task and relationship.** Identify the earliest layer contradicted by supplied observations without inventing a root cause.

**Response and template.** Controlled layer/status choice plus decisive evidence. `Given observations {observations}, what is the first failed dependency?`

**Generation and derivation.** Evaluate declared dependency graph in order and stop at first failed predicate; later unobserved layers remain “not tested.”

**Constraints.** Observations internally consistent. The answer is failed layer, not a unique physical cause.

**Difficulty.** L1 no link/ARP; L2 route/TCP; L3 TLS/application; L4 dual-stack or MTU black-hole signature with decisive probe.

**Misconceptions/distractors.** Blame DNS after a literal-IP test fails, call timeout “server down,” diagnose HTTP before TLS succeeds, treat one ping failure as proof of no route.

**Examples.**

1. link up but repeated ARP requests get no reply for on-link gateway → neighbor resolution is first failed dependency. L2.
2. DNS resolves, route/ARP succeed, SYN gets immediate RST → transport listener/refusal layer. L2.
3. TCP and TLS succeed, HTTP returns404 → application routing, not network connectivity. L2.

**Validation/coverage.** Dependency-state generator forbids success after a required earlier hard failure unless an alternative path is explicit.

### Family `counter_evidence_diagnose`

**Task and relationship.** Select the hypothesis best supported by interface, switch, router, firewall, and endpoint counters.

**Response and template.** Hypothesis plus supporting counter deltas. `{counters_before_after}; which conclusion is warranted?`

**Generation and derivation.** Compute deltas and compare them to the packet path: ingress without egress suggests a local decision/drop at that device; no ingress means failure earlier or wrong observation point.

**Constraints.** Counter semantics and reset/wrap behavior stated; answer wording remains evidential (“consistent with,” not absolute) unless the model makes it deductive.

**Difficulty.** L1 one interface; L2 two devices; L3 drop reason counter; L4 distinguish capture-point blindness from absence.

**Misconceptions/distractors.** Treat totals as deltas, assume any error counter caused this flow, infer downstream receipt from upstream egress alone.

**Examples.**

1. router ingress +10, route-drop +10, egress +0 → packets reached router and were dropped by modeled route decision. L2.
2. sender egress +5 but switch ingress +0 → problem lies on/before that observed link, not proven at server. L2.
3. firewall allow +5 and egress +5 does not prove application received them without downstream evidence. L3.

**Validation/coverage.** Generate counters from event model, then obscure selected observations.

### Family `duplicate_retransmission_diagnose`

**Task and relationship.** Distinguish a TCP retransmission, duplicate capture, new connection attempt, or application retry.

**Response and template.** Classification and matching fields. `Compare packets {a,b} at {capture_points/times}.`

**Generation and derivation.** Same connection and overlapping sequence/data after loss/timeout supports retransmission; identical packet observed at two points may be same traversal; new SYN with different tuple/ISN is new connection; new application message after completed response is application retry.

**Constraints.** Evidence needed for unique classification is supplied. Do not claim bit-identical packets across a router because link header/TTL changes.

**Difficulty.** L1 identical seq/payload same point; L2 two capture points; L3 NAT views; L4 application repeat versus transport retransmission.

**Misconceptions/distractors.** Any repeated payload is TCP retransmission, changed MAC means new flow, repeated SYN always same attempt.

**Examples.**

1. same tuple, seq1000–1099 repeated after timeout at same point → TCP retransmission. L2.
2. same IP packet seen before and after router with TTL/MAC changes → one forwarded packet, not duplicate send. L3.
3. second HTTP POST occurs on new TCP tuple after first got response → application retry/new request, not TCP retransmission. L4.

**Validation/coverage.** Event provenance labels generate observations; classifier answer derives from hidden provenance plus sufficiency check.

### Family `safe_observation_select`

**Task and relationship.** Choose the least invasive synthetic/operational observation that discriminates remaining hypotheses.

**Response and template.** Single choice. `Known facts are {facts}; which next observation best separates {hypotheses}?`

**Generation and derivation.** Score choices by whether outcomes partition the hypotheses, remain in authorized scope, and avoid changing service/network state.

**Constraints.** Choices are read-only or operate solely within the exercise simulator. No scanning third parties, packet injection, credential use, or disabling controls.

**Difficulty.** L1 inspect local table; L2 choose capture point; L3 select protocol-specific observation; L4 avoid a tempting but ambiguous test.

**Misconceptions/distractors.** Reboot/flush as diagnosis, broad scan, rely only on ping, change firewall before observing its counters.

**Examples.**

1. distinguish no route from unresolved next hop → inspect route result first, then neighbor table. L1.
2. SYN leaves client but no reply: capture/counter at server-side ingress discriminates path loss from listener behavior better than repeating faster. L3.
3. TLS succeeds but HTTP fails → inspect HTTP status/headers rather than ARP cache. L2.

**Validation/coverage.** Curated hypothesis/observation matrices; unsafe or state-changing actions cannot be correct.

### Cross-family progression

Single-packet decode precedes shuffled flows. Layer diagnosis begins with fully explicit evidence and later hides irrelevant details. Counter and retransmission families sharpen epistemic discipline. Safe-observation selection is last because it asks what evidence should be gathered next, not just what existing evidence means.

## 12. Topic-level progression

### Recommended introduction order

1. Layer/PDU matching, encapsulation, byte order, and explicit length boundaries.
2. Ethernet address classes, frame parsing, source learning, and forwarding.
3. On-link versus gateway resolution, then ARP.
4. IPv4 header parsing, routes, TTL, and one-router forwarding.
5. IPv6 base headers, Neighbor Discovery, and IPv4/IPv6 contrasts.
6. ICMP, traceroute, PMTU, and MSS.
7. UDP tuples and headers, then TCP handshake and sequence space.
8. DNS and DHCP exchanges.
9. HTTP framing, TLS roles, HTTP/2, and QUIC.
10. NAT, stateful policy, and ordered rule pipelines.
11. Packet-flow reconstruction and layered diagnosis.

### Dependency graph

```text
bytes + encapsulation
        |
        +--> Ethernet --> switching/VLANs
        |                    |
        |                    +--> ARP / IPv6 ND
        |                              |
        +--> IP headers --> routes -----+--> routed packet traces
                               |                  |
                               +--> TTL/ICMP -----+--> traceroute
                               +--> MTU ----------+--> fragmentation/MSS
                                                  |
ports + tuples ----------------------------------> UDP/TCP
                                                  |
                         DHCP/DNS ----------------+--> HTTP/TLS/QUIC
                                                  |
routes + tuples + TCP ---------------------------> NAT/firewall
                                                  |
all bounded families ----------------------------> packet diagnosis
```

### Level bands

The UI may expose five broad levels, but family-level mastery and dimensions remain primary.

| Band | Character of work | Typical state |
|---|---|---|
| L1 Recognition | identify a field, role, or one direct transform | one packet/header/table row, strong labels |
| L2 Single mechanism | execute one protocol rule exactly | one device or one request/reply |
| L3 Short trace | maintain state across several events | 2–5 packets, two tables, one exception |
| L4 Layer composition | cross two or three mastered mechanisms | routing + resolution + TCP, or DNAT + ACL |
| L5 Diagnosis/design constraint | distinguish competing explanations and select decisive evidence | partial capture, several plausible causes, explicit model boundaries |

No learner should receive an L4 composition merely because they answered unrelated L1 questions correctly. Each required component needs recent evidence of mastery.

### Interleaving policy

- Interleave IPv4 and IPv6 only after each base header and resolution mechanism has been introduced separately.
- Interleave ARP and ND specifically to reinforce “same role, different mechanism.”
- Interleave frame-size, IP-length, UDP-length, and MSS questions after each boundary is independently mastered.
- Pair forward NAT with reverse lookup; pair TCP send ranges with receiver acknowledgements.
- Keep checksum arithmetic sparse. It verifies structure but must not crowd out protocol reasoning.
- Use end-to-end traces as spaced synthesis, not the dominant daily mode.
- After an error in a composed trace, ask a minimal diagnostic family for the first wrong operation before merely shrinking every number.

## 13. Adaptive practice guidance

### Mastery dimensions

Track mastery by:

- category, subcategory, and question family;
- protocol/address family;
- representation: diagram, table, header fields, raw bytes, and timeline;
- direction: send/receive, forward/reverse, construct/decode;
- state depth: isolated event versus multi-event trace;
- misconception tag;
- boundary convention: payload, packet, frame, and on-wire accounting;
- degree of scaffolding;
- response latency separately from correctness.

Do not collapse all “networking” results into one score. A learner may be strong at subnet routing and weak at TCP sequence space or IPv6 multicast derivation.

### Misconception routing

| Observed error | Likely model | Next practice |
|---|---|---|
| ARPs for an off-link final destination | ARP treated as end-to-end lookup | paired on-link/default-gateway `next_hop_resolution_target` |
| Learns switch destination MAC | forwarding and learning conflated | show source-learning update before destination lookup |
| Floods across VLANs | VLAN seen as cosmetic tag | one-switch broadcast-isolation contrast |
| Preserves destination MAC through router | Ethernet envelope seen as end-to-end | annotated one-router `packet_path_header_change` |
| Changes IP address at every router | routing confused with NAT | matched router-without-NAT versus named-NAT pair |
| Uses offset bytes for IPv4 fragments | offset unit forgotten | construct byte intervals from offset×8 |
| Says IPv6 cannot fragment | router/source distinction missed | matched IPv4 router fragmentation and IPv6 source Fragment header |
| ACKs last byte received | next-expected convention missed | one-byte/short-range sequence examples with half-open intervals |
| Advances sequence for pure ACK | flags all assumed to consume sequence | SYN/data/ACK/FIN comparison |
| ACKs highest out-of-order byte | cumulative ACK/gap missed | visual receive-buffer gap family |
| Treats UDP/TCP same port as same flow | protocol omitted from tuple | demultiplex contrast on equal port numbers |
| Treats DNS as UDP-only | old shortcut overgeneralized | TC/TCP/reuse transport examples |
| Frames HTTP by TCP segment | stream versus message confused | split one response across segments and join two in one segment |
| Treats certificate as encryption key | authentication/key establishment conflated | TLS message-role matching |
| Treats NAT as firewall | translation and policy conflated | same mapping under allow and drop rules |
| Applies most-specific firewall rule | routing rule imported into ACL | ordered shadowing question |
| Blames an untested upper layer | diagnosis outruns evidence | `first_failed_layer` plus safe observation |

### Response to performance patterns

- Repeated wrong answers: reduce to the smallest family that isolates the misconception, restore labels, and compare one correct and one misconception-derived path.
- Slow but correct answers: keep conceptual level, reduce table size, and repeat after spacing; do not immediately demote the learner.
- Fast correct answers with strong scaffolding: remove labels or invert construct/decode direction before adding more devices.
- Representation-specific failures: preserve the concept while switching between a parsed field table and raw bytes, then return to the failed representation.
- IPv4 success/IPv6 failure: pair structurally corresponding questions, but preserve real differences rather than teaching text substitution.
- Arithmetic-only failure inside correct protocol reasoning: route briefly to length/byte-order practice and credit the protocol step separately.
- One error late in a long trace: resume from the last correct state in feedback and later ask a shorter trace beginning at that boundary.

### Mastery criteria

A family is provisionally mastered only after:

- correct performance across at least three structurally different parameter regions;
- success in both direct and inverse/trace direction when supported;
- no recurrence of its primary misconception in two spaced reviews;
- success once without optional annotations;
- at least one application in a composed family for prerequisite skills.

Speed goals are family-relative. Raw byte parsing may reasonably be slower than selecting an ICMP type. The app must not impose packet-professional time pressure on beginners.

## 14. Feedback and worked-solution design

### Feedback layers

Every answer may reveal progressively:

1. **Verdict:** correct/incorrect and field-level marks.
2. **Decisive rule:** one sentence, such as “A switch learns from the source MAC on the ingress VLAN.”
3. **State delta:** before/after row or highlighted bytes.
4. **Worked trace:** each event with input, rule, and resulting state.
5. **Contrast:** only when useful, show the plausible misconception result beside the correct result.

Do not reveal a ten-step solution when the first error was swapping two bytes. Conversely, do not say only “wrong” after a complex TCP or NAT timeline.

### Worked-example conventions

- Packet diagrams use consistent colors for link, IP, transport, and application layers, but also use labels/patterns so color is never the only signal.
- Mutable fields are highlighted at the exact hop where they change.
- Length solutions show a bracket or equation naming every counted byte.
- Routing solutions list all matching prefixes before selecting the longest.
- Fragmentation solutions show payload byte intervals and offset units.
- TCP solutions use half-open byte ranges, for example `[1001,1101)`, followed by `ACK=1101`.
- Cache/state solutions show absolute expiry time and remaining lifetime rather than vaguely saying “fresh.”
- Diagnosis feedback separates `observed`, `deduced`, and `not yet known`.

### Example diagnostic feedback

Learner answer: “ARP for `198.51.100.7`.”

> The destination is off-link. The `/24` connected route does not match, so the default route selects gateway `192.0.2.1`. ARP resolves the on-link next hop, therefore the target is `192.0.2.1`; the remote IP remains the IP destination inside the packet.

Learner answer: “ACK 1200” after receiving bytes `1200–1299` while byte `1100` is missing.

> TCP uses a cumulative acknowledgement for the next missing byte. The later bytes may be buffered, but the gap still begins at `1100`, so the ACK remains `1100`.

Learner answer: “Rule 4, because `/28` is more specific.”

> Longest-prefix selection belongs to routing. This firewall uses first match: rule 2 already matches the packet, so later rule 4 is not evaluated.

## 15. Rendering, interaction, and accessibility

### Required views

The standalone app needs reusable renderers for:

- packet stack cards;
- byte strips with offsets and field brackets;
- Ethernet/IP/TCP header diagrams;
- host–switch–router topology graphs;
- route, FDB, neighbor, NAT, connection-state, and rule tables;
- sequence-number lines and receive-buffer intervals;
- message-sequence/timeline diagrams;
- synthetic capture tables;
- layer dependency ladders.

All renderers consume the same semantic objects used by derivation and validation. Do not generate a picture and answer separately.

### Diagram requirements

- SVG elements have text alternatives and a corresponding linear table.
- Nodes and ports have stable short labels (`H1`, `S1:p2`, `R1:lan`).
- Directed links use arrowheads plus textual “from/to.”
- VLANs use labels and line patterns in addition to color.
- A learner can focus a packet/event and see all fields in reading order.
- Responsive layout may stack topology and tables but must not reorder event semantics.
- Dense diagrams offer zoom/pan controls that do not trap keyboard focus.

### Input controls

- Hex byte answers may use a segmented byte input with paste support.
- IPv6 input gives syntax feedback without penalizing a valid alternative compression.
- Ordered sequences support keyboard-accessible move controls in addition to drag and drop.
- Matching and multiple-choice controls have visible focus and are screen-reader labeled.
- Multi-field answers preserve already correct fields on retry unless exam mode explicitly disables this.
- Units are chosen with a control or accepted in text; they are never inferred from capitalization ambiguously.

### Motion and audio

Packet animation is optional and respects reduced-motion preferences. Every animation has a step-through equivalent. No exercise requires audio.

## 16. Implementation model

### Offline and safety contract

The app is a single standalone HTML/JavaScript/CSS page. At runtime it:

- makes no network requests;
- opens no socket or peer connection;
- enumerates no interfaces;
- reads no packet captures;
- uses no DNS resolver or public certificate store;
- executes no system command;
- requests no credentials or elevated browser permission.

All addresses, names, payloads, packets, timings, and device states are synthetic. A prominent Learn note explains that diagrams do not describe the learner's actual network.

### Core semantic types

At minimum, use explicit data structures equivalent to:

```text
MacAddress, IPv4Address, IPv6Address, Prefix
EthernetFrame, VlanTag, ArpMessage
IPv4Packet, IPv4Fragment, IPv6Packet, ExtensionHeader, IcmpMessage
UdpDatagram, TcpSegment, ByteInterval, TcpEndpointState
Interface, Link, Host, Switch, Router
PortConfig, FdbEntry, NeighborEntry, Route
DnsRecord, DnsMessage, DhcpMessage
HttpMessage, TlsHandshakeEvent, QuicConnectionEvent
NatMapping, ConntrackEntry, PolicyRule, PipelineStage
PacketObservation, CounterSnapshot, Event
```

Addresses are integers/byte arrays internally, never compared as display strings. Sequence-space helpers use unsigned 32-bit modular functions only for wraparound-labeled questions.

### Semantic-source rule

Question text, answer, choices, diagram, worked solution, and synthetic capture must all be projections of one immutable instance model. In particular:

- serialize headers from typed fields, then parse the bytes back;
- derive diagrams from topology objects;
- run events through the simulator to derive both capture rows and final tables;
- attach misconception tags to transformations that generate distractors;
- store the profile/model version with every saved question and seed.

### Simulators

Use small deterministic pure-state simulators rather than a general network emulator:

- learning bridge with per-VLAN FDB;
- ARP cache and bounded ND neighbor state;
- longest-prefix forwarding;
- IPv4 fragmentation/reassembly;
- TTL/Hop Limit and ICMP event generation;
- simplified TCP endpoint byte ranges and states;
- DNS cache/delegation traversal;
- DHCP transaction/lease timer;
- HTTP/1.1 restricted parser/framer;
- NAT/connection tracking and explicit policy pipeline.

Each simulator accepts an event and returns new state plus observations. Event ties are resolved by a generated stable index displayed when pedagogically relevant.

### Parsing and numeric limits

- Use `BigInt` or byte arrays for 128-bit IPv6 and values whose correctness would otherwise depend on JavaScript's 53-bit integer limit.
- Parse IPv6 to eight 16-bit groups after validating one optional `::`; accept embedded IPv4 only if that grammar is intentionally implemented and tested.
- Internet-checksum helpers operate over bytes and reject odd-length input unless the caller supplies the protocol-defined zero padding.
- Raw-header parsers are bounded to generated fixture lengths and never recursively process arbitrary uploaded data.
- HTTP parser accepts only the declared safe grammar and returns a structured error for ambiguous framing.

### Distractor generation

Distractors must be computed by named wrong transforms such as:

- reverse byte order;
- count the wrong length boundary;
- learn destination rather than source;
- resolve final off-link address;
- choose first route rather than longest;
- use fragment offset as bytes;
- preserve MAC through router;
- acknowledge last/highest byte rather than next contiguous byte;
- count a pure ACK as sequence space;
- treat DNS as UDP-only;
- frame HTTP at TCP segment boundary;
- treat NAT translation as an allow decision;
- apply firewall specificity instead of first match.

Store the transform ID with each choice so feedback can diagnose it. If two distractors normalize to the same value or equal the correct answer, regenerate the instance or replace the distractor using another applicable misconception.

### Randomization and reproducibility

- Use a seeded PRNG and store seed, model version, family ID, difficulty dimensions, and locale.
- Construct backward from a pedagogically useful outcome when random forward generation would overproduce trivial cases.
- Maintain recent structural fingerprints based on topology shape, header combination, answer pattern, and misconception—not merely text.
- User-visible synthetic identifiers should remain internally consistent throughout a session but need not persist across app versions.

### Localization

Protocol field names and standard acronyms may remain recognizable (`TTL`, `SYN`, `ARP`) while explanatory text is localized. Translators receive:

- glossary entries distinguishing frame/packet/segment/datagram/message;
- protected code/byte spans;
- plural and unit placeholders;
- grammatical context for direction and device roles;
- notes where “host,” “node,” “neighbor,” “gateway,” and “router” are not interchangeable.

Generated sentence assembly must use complete localized templates, not English word-order fragments.

## 17. Automated validation

### Per-instance checks

For every generated instance:

- all placeholders are substituted and escaped;
- prompt, semantic object, rendered diagram, answer, and worked trace agree;
- exactly one answer or normalized answer set is correct;
- every distractor is distinct and maps to an applicable misconception;
- all addresses, prefixes, field widths, lengths, and checksums are valid under the profile;
- all topology references point to existing nodes/ports and preserve VLAN/link constraints;
- all event sequences are deterministic under displayed ordering;
- all rejection rules are enforced;
- answer normalization cannot accept malformed prefixes, extra bytes, or out-of-range ports.

### Differential and property tests

Development tests must include:

- network-order encode/decode round trips for every supported integer width;
- Ethernet and VLAN serialize/parse round trips;
- FDB learning/forwarding invariants over random acyclic topologies;
- IPv4 and IPv6 prefix matching against an independent bit-string oracle;
- IPv4 checksum comparison against a second implementation and known vectors;
- IPv4 fragment plan/reassembly round trips, shuffled arrival, gaps, and rejected overlaps;
- solicited-node multicast derivation from a second 128-bit mask implementation;
- route selection invariance under route-table permutation except declared equal-prefix ordering;
- TTL/Hop Limit path simulation and ICMP outcome tables;
- UDP/IP nested-length conservation;
- TCP sequence-range, ACK, buffer-union, window, and FIN invariants;
- DNS cache expiry and delegation graph fixtures;
- DHCP state-machine transition coverage;
- HTTP/1.1 parser/framer fixtures including concatenated and split messages;
- NAT forward/reverse mapping round trips;
- ACL/pipeline snapshots and stateful return-flow properties;
- event-to-capture provenance and unique diagnosis tests.

Reference libraries or local command-line tools may be used only in development tests. Runtime correctness cannot depend on them.

### Fuzz targets

Before release, run at least:

- 100,000 encode/decode/checksum/length instances;
- 50,000 IPv4 and 50,000 IPv6 prefix/route decisions;
- 25,000 switch/VLAN topologies;
- 25,000 ARP/ND state traces;
- 25,000 fragmentation/reassembly sets;
- 50,000 TCP range/state traces;
- 10,000 DNS/DHCP exchanges;
- 10,000 HTTP framing streams;
- 25,000 NAT/firewall pipelines;
- every curated malformed/boundary corpus case.

The exact counts may be raised; lowering them requires documented equivalent exhaustive coverage.

### Standards conformance fixtures

For wire structures and exact rules, maintain reviewed fixtures linked in source metadata to the relevant standard section. A standards update does not silently mutate old generated questions. It causes:

1. review of the changed/obsoleted specification;
2. a new protocol profile or patch-level model identifier;
3. regenerated fixtures and differential tests;
4. a migration decision for saved questions;
5. a visible changelog entry.

### Content audit

Automated statistics over large seed sets must verify:

- category/family selection is not dominated by byte arithmetic or IPv4;
- direct and inverse directions both occur;
- positive and negative outcomes are balanced where meaningful;
- boundary values occur but do not dominate;
- every declared misconception is exercised;
- no raw dump exceeds the display budget;
- no real routable name/address slips past the synthetic-address validator;
- no unsafe diagnostic/action string appears in generated prompts.

## 18. Coverage requirements

The default mixed-practice pool should target these long-run proportions after prerequisites:

| Area | Target share |
|---|---:|
| Encapsulation and representation | 8% |
| Ethernet/VLANs | 12% |
| ARP/Neighbor Discovery | 10% |
| IPv4/IPv6 forwarding | 15% |
| ICMP/MTU/path behavior | 8% |
| UDP/TCP | 17% |
| DNS/DHCP | 9% |
| HTTP/TLS/QUIC | 8% |
| NAT/firewall | 8% |
| Integrated diagnosis | 5% |

Adaptive review may override these proportions for a learner. Within applicable families:

- IPv4/IPv6 should approach 55/45 after introductory progression, rather than leaving IPv6 as rare advanced content;
- TCP should not crowd UDP below one quarter of transport questions;
- raw-byte representations should remain below one third of all questions;
- at least half of switching questions should require actual state change rather than vocabulary;
- at least one third of advanced questions should include an evidence limitation or “not enough information” distinction;
- no more than one checksum-arithmetic question should appear in any ten-question general session by default.

## 19. Stable navigation and implementation priorities

### Navigation

The app should expose these learner-facing groups:

1. Packets & Encapsulation
2. Ethernet & VLANs
3. ARP & IPv6 Neighbors
4. IP & Routing
5. ICMP, MTU & Paths
6. UDP & TCP
7. DNS & DHCP
8. HTTP, TLS & QUIC
9. NAT & Firewalls
10. Packet Diagnosis

### Recommended v1 implementation slice

A satisfying first release should implement:

- all of Categories 2–7 except advanced IPv6 extension-chain malformed cases;
- DNS record/cache/transport and DHCP DORA;
- HTTP/1.1 parsing/framing and basic TLS roles;
- source PAT, return lookup, first-match ACL, and stateful return traffic;
- single-packet decode, short flow ordering, and first-failed-layer diagnosis.

HTTP/2, QUIC migration, SLAAC/DAD timers, tunnels, multi-switch VLAN traces, and full pipeline comparison may ship in a second increment. Their specifications remain here so early semantic types do not block them.

### Low-value or unsuitable dynamic content

Do not build families for:

- memorizing long port-number lists;
- expanding protocol acronyms without a scenario;
- verbatim RFC requirement recall;
- vendor configuration commands without a simulator and declared platform;
- guessing what encrypted payload contains;
- interpreting arbitrary real captures whose context is unavailable;
- open-ended “design a network” answers;
- security advice judged from free prose.

These are better as reference material, controlled case studies, or a separate configuration lab.

## 20. Standards and reference profile

The source code should record exact section references per modeled field/rule. The following are the primary baseline documents for `network-protocols-v1`; later updates or errata must be reviewed explicitly:

- IEEE 802.3, Ethernet;
- IEEE 802.1Q, bridges and VLANs;
- RFC 826, Ethernet Address Resolution Protocol;
- RFC 791, Internet Protocol, as updated by later standards relevant to implemented behavior;
- RFC 8200, Internet Protocol Version 6;
- RFC 4861, Neighbor Discovery for IPv6, plus applicable updates;
- RFC 4291, IPv6 Addressing Architecture;
- RFC 4443, ICMPv6;
- RFC 8201, IPv6 Path MTU Discovery;
- RFC 768, User Datagram Protocol, with implemented updates reviewed;
- RFC 9293, Transmission Control Protocol;
- RFC 1034 and RFC 1035, Domain Names;
- RFC 7766, DNS Transport over TCP;
- RFC 2131, DHCPv4, with the implemented updates reviewed;
- RFC 9110 and RFC 9112, HTTP semantics and HTTP/1.1;
- RFC 9113, HTTP/2;
- RFC 9846, TLS 1.3;
- RFC 9000 and RFC 9001, QUIC transport and TLS use;
- RFC 9002 only if loss-detection behavior is later implemented.

The app teaches the pinned subset described here, not every optional or updated behavior in those documents.

## 21. Topic-level quality checklist

Before accepting an implementation:

- [ ] Every question is derived from a versioned semantic instance.
- [ ] Every family can generate materially different, nontrivial instances.
- [ ] Frame/packet/segment/message and length boundaries are named precisely.
- [ ] Network byte order is consistent in bytes, diagrams, answers, and feedback.
- [ ] Ethernet sizes explicitly state FCS/preamble/SFD/IFG treatment.
- [ ] FDB learning uses source MAC and VLAN before forwarding.
- [ ] Flooding never escapes the modeled VLAN or returns on ingress.
- [ ] Off-link traffic resolves the next-hop router, not the final destination.
- [ ] ARP and IPv6 ND remain distinct.
- [ ] IPv6 input comparison is semantic, not string-based.
- [ ] IPv4 fragment offsets use eight-byte units and generated sets reassemble exactly.
- [ ] IPv6 routers never fragment in the pinned model.
- [ ] Route selection uses longest prefix before equal-prefix metric.
- [ ] TCP ACKs denote the next expected byte; SYN/FIN consume one, pure ACK consumes none.
- [ ] TCP exercises do not imply a complete congestion-control or timing model.
- [ ] DNS questions do not teach “UDP only.”
- [ ] HTTP messages are not equated with TCP segments.
- [ ] TLS/QUIC questions avoid unmodeled cryptographic claims and performance absolutes.
- [ ] NAT translation and firewall authorization are taught separately.
- [ ] Firewall/NAT order is printed and never presented as universal.
- [ ] Diagnosis distinguishes evidence, inference, and unknowns.
- [ ] Distractors correspond to named misconceptions.
- [ ] Feedback identifies the first incorrect transition.
- [ ] Difficulty rises through state and layer composition rather than dump length.
- [ ] IPv6 is core content, not a token final category.
- [ ] All addresses/names and traffic are synthetic.
- [ ] The standalone app makes no runtime network request and requests no network permission.
- [ ] Automated tests cover boundaries, round trips, state transitions, and large seed samples.
- [ ] Every external standard fact has a pinned profile/reference and update path.
- [ ] Repeated practice improves packet reasoning rather than static acronym recall.
