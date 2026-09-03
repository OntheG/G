import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
type Tab = "overview" | "apply" | "renew" | "lost" | "status";
type OfficeTab = "contact" | "departments" | "hours";

// ─── Data ────────────────────────────────────────────────────────────────────
const NAV = [
  { label: "Home", href: "#" },
  {
    label: "Services",
    children: ["ID Card Services", "Travel Documents", "Driving Licence", "Birth Registration", "Death Registration"],
  },
  {
    label: "Head Office",
    children: ["Contact & Location", "Opening Hours", "Departments", "Book an Appointment"],
  },
  { label: "News", href: "#" },
  { label: "Guidance", href: "#" },
  { label: "About GSTK", href: "#" },
];

const QUICK_LINKS = [
  { icon: "🪪", label: "Apply for ID Card", tag: "Online", href: "#id" },
  { icon: "🔄", label: "Renew ID Card", tag: "Online", href: "#id" },
  { icon: "🔍", label: "Track Application", tag: "24/7", href: "#id" },
  { icon: "📍", label: "Find Your Office", tag: "Nationwide", href: "#office" },
  { icon: "📅", label: "Book Appointment", tag: "Free", href: "#office" },
  { icon: "📋", label: "Download Forms", tag: "PDF", href: "#" },
];

const STATS = [
  { value: "2.4M+", label: "ID Cards Issued", sub: "in 2025–26" },
  { value: "97.3%", label: "Satisfaction Rate", sub: "applicant survey" },
  { value: "3 Days", label: "Average Processing", sub: "express service" },
  { value: "148", label: "Service Centres", sub: "across the Kingdom" },
];

const ID_REQUIREMENTS = [
  "Original birth certificate or valid passport",
  "Proof of address (utility bill or bank statement, dated within 3 months)",
  "One recent passport-sized photograph (35mm × 45mm, plain background)",
  "National Insurance number (if applicable)",
  "Completed GS/ID-01 application form",
];

const ID_FEES = [
  { type: "Standard Application", duration: "10–14 working days", fee: "£35.00" },
  { type: "Express Application", duration: "3–5 working days", fee: "£65.00" },
  { type: "Same-Day Collection", duration: "Same day (pre-booked)", fee: "£110.00" },
  { type: "Replacement (Lost/Stolen)", duration: "10–14 working days", fee: "£45.00" },
  { type: "Replacement (Damaged)", duration: "10–14 working days", fee: "£25.00" },
  { type: "Child ID (Under 16)", duration: "10–14 working days", fee: "£20.00" },
];

const DEPARTMENTS = [
  {
    name: "Identity & Documentation",
    head: "Director H. Worthington",
    ext: "101",
    email: "identity@gstk.gov.uk",
    services: ["National ID Cards", "Birth & Death Certificates", "Name Change Registration"],
  },
  {
    name: "Travel & Border Services",
    head: "Director A. Pemberton",
    ext: "102",
    email: "travel@gstk.gov.uk",
    services: ["Passport Processing", "Visa Endorsements", "Border Clearance"],
  },
  {
    name: "Civil Registration",
    head: "Director M. Hargreaves",
    ext: "103",
    email: "civil@gstk.gov.uk",
    services: ["Marriage Registration", "Adoption Records", "Genealogy Requests"],
  },
  {
    name: "Digital Services Unit",
    head: "Director T. Blackwood",
    ext: "104",
    email: "digital@gstk.gov.uk",
    services: ["Online Application Portal", "Digital ID Verification", "API Integration"],
  },
];

const HOURS = [
  { day: "Monday", open: "08:30", close: "17:00", note: "" },
  { day: "Tuesday", open: "08:30", close: "17:00", note: "" },
  { day: "Wednesday", open: "10:00", close: "17:00", note: "Late opening" },
  { day: "Thursday", open: "08:30", close: "17:00", note: "" },
  { day: "Friday", open: "08:30", close: "16:30", note: "Early close" },
  { day: "Saturday", open: "09:00", close: "13:00", note: "By appointment only" },
  { day: "Sunday", open: "—", close: "—", note: "Closed" },
];

const NEWS = [
  {
    date: "2 September 2026",
    tag: "Announcement",
    title: "New Digital ID Card Pilot Launches Across 12 Service Centres",
    body: "GSTK is pleased to announce the expansion of its biometric digital ID card pilot, now available at 12 service centres nationwide. The new cards include embedded NFC chips for secure contactless verification.",
    img: "photo-1450101499163-c8848c66ca85",
  },
  {
    date: "28 August 2026",
    tag: "Guidance",
    title: "Updated Photograph Requirements for ID Card Applications from 1 October 2026",
    body: "New international standards for identity document photographs take effect from 1 October 2026. Applicants are advised to review the updated guidance before submitting applications.",
    img: "photo-1486325212027-8081e485255e",
  },
  {
    date: "20 August 2026",
    tag: "Notice",
    title: "Planned Maintenance: Online Application Portal Unavailable 6–7 September",
    body: "The GSTK online application portal will be unavailable from 23:00 on Saturday 6 September to 06:00 on Sunday 7 September for scheduled infrastructure maintenance.",
    img: "photo-1517048676732-d65bc937f952",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Badge({ label, variant = "default" }: { label: string; variant?: "default" | "online" | "notice" | "guide" }) {
  const styles: Record<string, string> = {
    default: "bg-[#f7e4ea] text-[#461e29]",
    online: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    notice: "bg-amber-50 text-amber-700 border border-amber-200",
    guide: "bg-sky-50 text-sky-700 border border-sky-200",
  };
  return (
    <span className={`inline-flex items-center text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 ${styles[variant]}`}>
      {label}
    </span>
  );
}

function IdCardSection() {
  const [tab, setTab] = useState<Tab>("overview");

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "apply", label: "New Application" },
    { id: "renew", label: "Renewal" },
    { id: "lost", label: "Lost or Stolen" },
    { id: "status", label: "Track Status" },
  ];

  return (
    <section id="id" className="py-16 bg-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-8 bg-[#461e29]" />
              <span className="text-[#461e29] text-xs font-semibold tracking-widest uppercase">Identity Services</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-gray-900">
              National Identity Card
            </h2>
            <p className="text-gray-500 mt-1 text-sm">
              Apply, renew, or replace your GSTK National Identity Card online or in person.
            </p>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-[#461e29] text-white px-5 py-2.5 text-sm font-semibold hover:bg-[#5e2535] transition-colors self-start sm:self-auto"
          >
            Apply Now
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-gray-200 mb-8 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                tab === t.id
                  ? "border-[#461e29] text-[#461e29]"
                  : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {tab === "overview" && (
              <>
                <div className="bg-[#fdf2f5] border-l-4 border-[#461e29] p-5">
                  <h3 className="font-semibold text-gray-900 mb-1">About the National Identity Card</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    The GSTK National Identity Card is an official government-issued document that confirms your identity within the Kingdom. It is accepted as proof of identity for all domestic purposes and in many international contexts.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Card Features</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { icon: "🔒", label: "Biometric Data", desc: "Fingerprint and facial recognition data stored securely" },
                      { icon: "📡", label: "NFC Chip", desc: "Contactless verification at supported terminals" },
                      { icon: "🌐", label: "EU/EEA Compatible", desc: "Accepted across 30+ European nations" },
                      { icon: "♿", label: "Accessibility", desc: "Raised tactile markings for visually impaired holders" },
                      { icon: "🛡️", label: "Holographic Security", desc: "Advanced anti-counterfeit hologram overlay" },
                      { icon: "📅", label: "10-Year Validity", desc: "5 years for applicants under 16" },
                    ].map((f) => (
                      <div key={f.label} className="flex gap-3 p-3 bg-gray-50 border border-gray-100">
                        <span className="text-xl flex-shrink-0">{f.icon}</span>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{f.label}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{f.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Fee Schedule</h3>
                  <div className="border border-gray-200 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#461e29] text-white">
                          <th className="text-left px-4 py-2.5 font-medium">Service Type</th>
                          <th className="text-left px-4 py-2.5 font-medium hidden sm:table-cell">Processing Time</th>
                          <th className="text-right px-4 py-2.5 font-medium">Fee</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ID_FEES.map((row, i) => (
                          <tr key={row.type} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="px-4 py-2.5 text-gray-900">{row.type}</td>
                            <td className="px-4 py-2.5 text-gray-500 hidden sm:table-cell">{row.duration}</td>
                            <td className="px-4 py-2.5 text-right font-mono font-medium text-gray-900">{row.fee}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {tab === "apply" && (
              <div className="space-y-6">
                <div className="bg-emerald-50 border border-emerald-200 p-4 flex gap-3">
                  <span className="text-emerald-600 text-lg flex-shrink-0">✓</span>
                  <p className="text-sm text-emerald-800">
                    You can complete your application entirely online. Processing begins as soon as your documents are verified.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Documents Required</h3>
                  <ul className="space-y-2">
                    {ID_REQUIREMENTS.map((r) => (
                      <li key={r} className="flex gap-3 text-sm text-gray-700">
                        <span className="text-[#461e29] flex-shrink-0 mt-0.5">▸</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Application Steps</h3>
                  <div className="space-y-3">
                    {[
                      "Create or sign in to your GSTK account at my.gstk.gov.uk",
                      "Complete the online GS/ID-01 form with your personal details",
                      "Upload digital copies of your supporting documents",
                      "Submit your application and pay the processing fee",
                      "Attend your biometric appointment at a local service centre",
                      "Receive your ID card by Royal Mail Tracked delivery",
                    ].map((step, i) => (
                      <div key={step} className="flex gap-4 items-start">
                        <div className="w-7 h-7 bg-[#461e29] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <p className="text-sm text-gray-700 pt-1">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <a href="#" className="inline-flex items-center gap-2 bg-[#461e29] text-white px-6 py-3 text-sm font-semibold hover:bg-[#5e2535] transition-colors">
                  Start Application →
                </a>
              </div>
            )}

            {tab === "renew" && (
              <div className="space-y-5">
                <div className="bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
                  <strong>Renewal Notice:</strong> You may renew your ID card up to 9 months before its expiry date. Your remaining validity is not carried over to the new card.
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  If your card expires within 9 months, or has already expired, you can apply for a renewal. You will need your current card and one piece of supporting documentation confirming your address.
                </p>
                <div className="border border-gray-200 p-4 bg-gray-50">
                  <h4 className="font-semibold text-sm text-gray-900 mb-3">Check Your Eligibility</h4>
                  <div className="space-y-2">
                    <input className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#461e29]" placeholder="Enter current card number (e.g. GK-2024-XXXXXX)" />
                    <input className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#461e29]" placeholder="Date of birth (DD/MM/YYYY)" />
                    <button className="w-full bg-[#461e29] text-white py-2 text-sm font-semibold hover:bg-[#5e2535] transition-colors">
                      Check Eligibility
                    </button>
                  </div>
                </div>
              </div>
            )}

            {tab === "lost" && (
              <div className="space-y-5">
                <div className="bg-red-50 border border-red-200 p-4 text-sm text-red-800">
                  <strong>Important:</strong> You must report a lost or stolen ID card within 48 hours. Failing to do so may result in liability for misuse of your identity documents.
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <a href="#" className="border-2 border-[#461e29] p-4 hover:bg-[#fdf2f5] transition-colors group">
                    <div className="font-semibold text-sm text-gray-900 group-hover:text-[#461e29]">Report Online</div>
                    <div className="text-xs text-gray-500 mt-1">Available 24/7 — report at my.gstk.gov.uk</div>
                  </a>
                  <a href="tel:08001234567" className="border border-gray-200 p-4 hover:border-[#461e29] transition-colors group">
                    <div className="font-semibold text-sm text-gray-900 group-hover:text-[#461e29]">Call the Helpline</div>
                    <div className="text-xs text-gray-500 mt-1">0800 123 4567 — Mon–Fri, 08:30–17:00</div>
                  </a>
                </div>
                <p className="text-sm text-gray-600">After reporting, you can apply for a replacement card using the standard replacement application process. The fee for a replacement is £45.00 for standard processing.</p>
              </div>
            )}

            {tab === "status" && (
              <div className="space-y-5">
                <p className="text-sm text-gray-600">
                  Track the progress of your ID card application using your application reference number and date of birth.
                </p>
                <div className="border border-gray-200 p-5 bg-gray-50">
                  <h4 className="font-semibold text-sm text-gray-900 mb-4">Track Your Application</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1">Application Reference</label>
                      <input className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#461e29] font-mono" placeholder="e.g. APP-2026-0094821" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1">Date of Birth</label>
                      <input className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#461e29]" placeholder="DD/MM/YYYY" />
                    </div>
                    <button className="w-full bg-[#461e29] text-white py-2.5 text-sm font-semibold hover:bg-[#5e2535] transition-colors">
                      Track Application
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-500 border-l-2 border-gray-200 pl-3">
                  Application status is updated every 2 hours during business hours. If your application was submitted more than 14 working days ago and you have not received your card, please contact us.
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* ID Card visual */}
            <div className="bg-gradient-to-br from-[#461e29] to-[#2c1019] p-5 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 border border-white/10 rounded-full -translate-y-8 translate-x-8" />
              <div className="absolute bottom-0 left-0 w-16 h-16 border border-white/10 rounded-full translate-y-6 -translate-x-6" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center text-xs">🦅</div>
                  <div>
                    <div className="text-[9px] tracking-widest uppercase opacity-70">Kingdom of</div>
                    <div className="text-xs font-bold tracking-wide">GSTK</div>
                  </div>
                  <div className="ml-auto text-[9px] opacity-50 font-mono">NATIONAL ID</div>
                </div>
                <div className="w-10 h-10 bg-white/20 rounded mb-3 flex items-center justify-center text-xl">👤</div>
                <div className="text-xs opacity-70 mb-0.5 tracking-wide">SURNAME</div>
                <div className="font-semibold text-sm mb-3">WHITMORE</div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div><div className="opacity-50">DOB</div><div className="font-mono">14 MAR 1988</div></div>
                  <div><div className="opacity-50">EXPIRES</div><div className="font-mono">14 MAR 2034</div></div>
                  <div className="col-span-2"><div className="opacity-50">CARD NO.</div><div className="font-mono tracking-widest">GK-2024-004821</div></div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="font-mono text-[8px] opacity-40 tracking-widest">GSTK&lt;&lt;WHITMORE&lt;&lt;JAMES&lt;&lt;EDWARD&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</div>
                </div>
              </div>
            </div>

            <div className="bg-[#fdf2f5] border border-[#ebbdca] p-4">
              <div className="font-semibold text-sm text-[#461e29] mb-2">Need Help?</div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span>08xx xxxx xxxx</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>id@gstk.gov.uk</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Mon–Fri, 08:30–17:00</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 p-4">
              <div className="font-semibold text-sm text-gray-900 mb-3">Related Services</div>
              <div className="space-y-1.5">
                {["Passport Application", "Driving Licence", "Biometric Residence Permit", "Emergency Travel Doc"].map((s) => (
                  <a key={s} href="#" className="flex items-center justify-between text-sm text-[#461e29] hover:text-[#5e2535] py-0.5">
                    <span>{s}</span>
                    <span className="text-xs opacity-50">→</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeadOfficeSection() {
  const [tab, setTab] = useState<OfficeTab>("contact");
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long" });

  return (
    <section id="office" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-8 bg-[#461e29]" />
              <span className="text-[#461e29] text-xs font-semibold tracking-widest uppercase">Head Office</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-gray-900">
              GSTK Central Office
            </h2>
            <p className="text-gray-500 mt-1 text-sm">Westminster, London — Our principal office for all government identity services.</p>
          </div>
          <a href="#" className="inline-flex items-center gap-2 border border-[#461e29] text-[#461e29] px-5 py-2.5 text-sm font-semibold hover:bg-[#fdf2f5] transition-colors self-start sm:self-auto">
            Book Appointment
          </a>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: tabs */}
          <div className="lg:col-span-2 space-y-0">
            <div className="flex border-b border-gray-200 bg-white">
              {(["contact", "departments", "hours"] as OfficeTab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-5 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                    tab === t ? "border-[#461e29] text-[#461e29]" : "border-transparent text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {t === "contact" ? "Contact & Location" : t === "departments" ? "Departments" : "Opening Hours"}
                </button>
              ))}
            </div>

            <div className="bg-white border border-t-0 border-gray-200 p-6">
              {tab === "contact" && (
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-5">
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Address</div>
                      <address className="not-italic text-sm text-gray-700 leading-relaxed">
                        GSTK Central Office<br />
                        1 Parliament Square<br />
                        Westminster<br />
                        London<br />
                        SW1A 1AA
                      </address>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">General Enquiries</div>
                      <div className="space-y-1 text-sm">
                        <div><span className="text-gray-400">Tel:</span> <a href="tel:02071234567" className="text-[#461e29] hover:underline">+44 (0)20 7123 4567</a></div>
                        <div><span className="text-gray-400">Fax:</span> <span className="text-gray-700">+44 (0)20 7123 4568</span></div>
                        <div><span className="text-gray-400">Email:</span> <a href="mailto:info@gstk.gov.uk" className="text-[#461e29] hover:underline">info@gstk.gov.uk</a></div>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Emergency Out-of-Hours</div>
                      <div className="text-sm text-gray-700">0800 999 3210 <span className="text-xs text-gray-400">(24/7)</span></div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Transport Links</div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div>Westminster (Circle, District, Jubilee)</div>
                        <div>Routes 11, 24, 87, 211</div>
                        <div>Limited on-site visitor parking</div>
                      </div>
                    </div>
                  </div>
                  {/* Map placeholder */}
                  <div className="bg-gray-100 border border-gray-200 relative overflow-hidden min-h-[240px] flex flex-col items-center justify-center">
                    <div className="absolute inset-0 opacity-30" style={{
                      backgroundImage: "repeating-linear-gradient(0deg, #d1d5db 0, #d1d5db 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #d1d5db 0, #d1d5db 1px, transparent 1px, transparent 40px)"
                    }} />
                    <div className="relative text-center">
                      <div className="text-3xl mb-2">📍</div>
                      <div className="text-sm font-semibold text-gray-700">1 Parliament Square</div>
                      <div className="text-xs text-gray-500">Westminster, London SW1A 1AA</div>
                      <a href="#" className="mt-3 inline-block text-xs text-[#461e29] border border-[#461e29] px-3 py-1 hover:bg-[#fdf2f5] transition-colors">
                        Open in Maps
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {tab === "departments" && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {DEPARTMENTS.map((d) => (
                    <div key={d.name} className="border border-gray-200 p-4 hover:border-[#461e29]/40 transition-colors">
                      <div className="font-semibold text-sm text-gray-900 mb-1">{d.name}</div>
                      <div className="text-xs text-gray-500 mb-3">{d.head}</div>
                      <div className="space-y-1 text-xs text-gray-600 mb-3">
                        <div>Ext. <span className="font-mono">{d.ext}</span></div>
                        <div><a href={`mailto:${d.email}`} className="text-[#461e29] hover:underline">{d.email}</a></div>
                      </div>
                      <div className="border-t border-gray-100 pt-2 space-y-0.5">
                        {d.services.map((s) => (
                          <div key={s} className="text-xs text-gray-500 flex gap-1">
                            <span className="text-[#461e29]">·</span>{s}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {tab === "hours" && (
                <div>
                  <div className="border border-gray-200 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="text-left px-4 py-2.5 font-semibold text-gray-700">Day</th>
                          <th className="text-left px-4 py-2.5 font-semibold text-gray-700">Opens</th>
                          <th className="text-left px-4 py-2.5 font-semibold text-gray-700">Closes</th>
                          <th className="text-left px-4 py-2.5 font-semibold text-gray-700 hidden sm:table-cell">Note</th>
                        </tr>
                      </thead>
                      <tbody>
                        {HOURS.map((h) => {
                          const isToday = today.toLowerCase().startsWith(h.day.toLowerCase());
                          return (
                            <tr key={h.day} className={`border-b border-gray-100 ${isToday ? "bg-[#fdf2f5]" : ""}`}>
                              <td className="px-4 py-2.5 font-medium text-gray-900">
                                {h.day}
                                {isToday && <span className="ml-2 text-[10px] bg-[#461e29] text-white px-1.5 py-0.5 font-semibold">TODAY</span>}
                              </td>
                              <td className="px-4 py-2.5 font-mono text-gray-700">{h.open}</td>
                              <td className="px-4 py-2.5 font-mono text-gray-700">{h.close}</td>
                              <td className="px-4 py-2.5 text-gray-500 text-xs hidden sm:table-cell">{h.note}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 text-xs text-amber-800">
                    Public and Bank Holidays: GSTK Central Office is closed on all statutory public holidays in England. Emergency services remain available on 0800 999 3210.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            <div className="bg-[#461e29] text-white p-5">
              <div className="text-xs tracking-widest uppercase opacity-60 mb-1">Book Online</div>
              <div className="font-display text-lg font-semibold mb-2">Schedule a Visit</div>
              <p className="text-xs opacity-70 mb-4 leading-relaxed">
                Pre-booking is strongly advised for biometric appointments. Walk-in capacity is limited.
              </p>
              <div className="space-y-2">
                <input className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm px-3 py-2 focus:outline-none focus:border-white/50" placeholder="Full name" />
                <input className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm px-3 py-2 focus:outline-none focus:border-white/50" placeholder="Reference number (optional)" />
                <select className="w-full bg-white/10 border border-white/20 text-white text-sm px-3 py-2 focus:outline-none focus:border-white/50">
                  <option value="">Select service type</option>
                  <option>New ID Card — Biometrics</option>
                  <option>Renewal — Document Check</option>
                  <option>General Enquiry</option>
                  <option>Emergency Certificate</option>
                </select>
                <button className="w-full bg-white text-[#461e29] font-semibold text-sm py-2.5 hover:bg-[#fdf2f5] transition-colors">
                  Check Availability
                </button>
              </div>
            </div>

            <div className="border border-gray-200 bg-white p-4">
              <div className="font-semibold text-sm text-gray-900 mb-3">Regional Offices</div>
              <div className="space-y-2">
                {[
                  ["Manchester", "0161 234 5678"],
                  ["Birmingham", "0121 234 5678"],
                  ["Edinburgh", "0131 234 5678"],
                  ["Cardiff", "0292 234 5678"],
                  ["Belfast", "0289 234 5678"],
                ].map(([city, tel]) => (
                  <div key={city} className="flex items-center justify-between text-sm py-1 border-b border-gray-50">
                    <span className="text-gray-700">{city}</span>
                    <a href={`tel:${tel.replace(/\s/g, "")}`} className="font-mono text-xs text-[#461e29] hover:underline">{tel}</a>
                  </div>
                ))}
              </div>
              <a href="#" className="mt-3 inline-block text-xs text-[#461e29] font-semibold hover:underline">View all 148 locations →</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <div className="min-h-full bg-white" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* Crown notice bar */}
      <div className="bg-[#1a0b10] text-[#ebbdca] text-[11px] py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span>An official website of God Save The King &mdash; <a href="#" className="underline opacity-70 hover:opacity-100">How to recognise official GSTK sites</a></span>
          <div className="hidden sm:flex gap-4 opacity-60">
            <a href="#" className="hover:opacity-100">Cymraeg</a>
            <span>|</span>
            <a href="#" className="hover:opacity-100">Accessibility</a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-[#461e29] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 border border-white/20 flex items-center justify-center text-2xl flex-shrink-0">
              GSTK
            </div>
            <div>
              <div className="text-white font-display text-2xl sm:text-3xl font-semibold tracking-tight leading-none">GSTK</div>
              <div className="text-[#d4849a] text-[10px] tracking-[0.25em] uppercase mt-0.5">God Save The King</div>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1.5 text-sm text-white/70">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input className="bg-transparent placeholder-white/40 text-white text-sm focus:outline-none w-36" placeholder="Search GSTK…" />
            </div>
            <a href="#" className="hidden sm:flex items-center gap-1.5 bg-white text-[#461e29] text-xs font-bold px-3.5 py-2 hover:bg-[#fdf2f5] transition-colors">
              <span>Sign In</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <button className="lg:hidden text-white p-1" onClick={() => setMobileOpen(!mobileOpen)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-[#2c1019] border-b border-[#461e29]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="hidden lg:flex">
            {NAV.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <a
                  href={item.href || "#"}
                  className="flex items-center gap-1 px-4 py-3.5 text-sm font-medium text-[#ebbdca] hover:text-white hover:bg-[#461e29] transition-colors"
                >
                  {item.label}
                  {item.children && (
                    <svg className="w-3 h-3 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
                    </svg>
                  )}
                </a>
                {item.children && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 w-52 bg-[#1a0b10] border border-[#461e29]/40 shadow-2xl z-50 py-1">
                    {item.children.map((child) => (
                      <a key={child} href="#" className="block px-4 py-2.5 text-sm text-[#d4849a] hover:bg-[#461e29] hover:text-white transition-colors">
                        {child}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          {mobileOpen && (
            <div className="lg:hidden py-2">
              {NAV.map((item) => (
                <a key={item.label} href="#" className="block px-4 py-2.5 text-sm text-[#ebbdca] hover:bg-[#461e29]">{item.label}</a>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative bg-[#461e29] overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&h=600&fit=crop&auto=format')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2c1019]/60 to-[#461e29]/80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="max-w-2xl">
            <Badge label="Official GSTK Portal" />
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white font-semibold mt-4 mb-4 leading-tight">
              Your Gateway to Government Services
            </h1>
            <p className="text-[#d4849a] text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
              Apply for national identity documents, access civil records, and connect with GSTK departments — all in one place.
            </p>
            {/* Search */}
            <div className="flex gap-0 max-w-lg">
              <input
                className="flex-1 bg-white border-0 px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#b85470] text-gray-900 placeholder-gray-400"
                placeholder="Search for a service, form, or guidance…"
              />
              <button className="bg-white/20 border border-white/30 text-white px-5 py-3.5 text-sm font-semibold hover:bg-white/30 transition-colors flex-shrink-0">
                Search
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Apply for ID Card", "Track Application", "Book Appointment", "Find Office"].map((s) => (
                <a key={s} href="#" className="text-xs text-[#ebbdca]/70 hover:text-white hover:underline">
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="relative border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center py-2">
                <div className="font-display text-2xl sm:text-3xl text-white font-semibold">{s.value}</div>
                <div className="text-[#d4849a] text-xs font-medium mt-0.5">{s.label}</div>
                <div className="text-white/40 text-[10px]">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="bg-gray-50 border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-4">Popular Services</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {QUICK_LINKS.map((q) => (
              <a
                key={q.label}
                href={q.href}
                className="group bg-white border border-gray-200 hover:border-[#461e29]/40 hover:shadow-sm p-4 transition-all text-center"
              >
                <div className="text-2xl mb-2">{q.icon}</div>
                <div className="text-xs font-semibold text-gray-900 group-hover:text-[#461e29] transition-colors leading-tight">{q.label}</div>
                <div className="mt-1.5 inline-flex items-center text-[9px] bg-[#fdf2f5] text-[#461e29] px-1.5 py-0.5 font-semibold tracking-wide uppercase">{q.tag}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ID Card Section */}
      <IdCardSection />

      {/* Head Office Section */}
      <HeadOfficeSection />

      {/* News */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-8 bg-[#461e29]" />
                <span className="text-[#461e29] text-xs font-semibold tracking-widest uppercase">Latest</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-gray-900">News & Notices</h2>
            </div>
            <a href="#" className="text-sm text-[#461e29] font-semibold hover:underline hidden sm:block">All news →</a>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {NEWS.map((item, i) => (
              <article key={item.title} className="group border border-gray-200 bg-white hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden">
                <div className="h-40 overflow-hidden bg-gray-200">
                  <img
                    src={`https://images.unsplash.com/${item.img}?w=600&h=300&fit=crop&auto=format`}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      label={item.tag}
                      variant={item.tag === "Announcement" ? "default" : item.tag === "Notice" ? "notice" : "guide"}
                    />
                    <span className="text-xs text-gray-400">{item.date}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 group-hover:text-[#461e29] transition-colors">
                    {item.title}
                  </h3>
                  {i === 0 && (
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{item.body}</p>
                  )}
                  <a href="#" className="mt-3 inline-flex items-center gap-1 text-xs text-[#461e29] font-semibold hover:underline">
                    Read more <span>→</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-[#2c1019] py-12 border-y border-[#461e29]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl text-white font-semibold mb-1">Can't find what you're looking for?</h3>
            <p className="text-[#d4849a] text-sm">Our support team is ready to assist you — Monday to Friday, 08:30 to 17:00.</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <a href="tel:08001234567" className="bg-white text-[#461e29] px-5 py-2.5 text-sm font-bold hover:bg-[#fdf2f5] transition-colors whitespace-nowrap">
              0800 123 4567
            </a>
            <a href="#" className="border border-[#ebbdca]/30 text-[#ebbdca] px-5 py-2.5 text-sm font-medium hover:bg-white/5 transition-colors whitespace-nowrap">
              Live Chat
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a0b10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-[#461e29] border border-[#5e2535] flex items-center justify-center text-base">G</div>
              <div>
                <div className="font-display font-semibold text-white">GSTK</div>
                <div className="text-[10px] text-[#d4849a]/60 tracking-widest uppercase">gov.uk</div>
              </div>
            </div>
            <p className="text-[#d4849a]/50 text-xs leading-relaxed mb-4">
              Government Services &amp; Technology of the Kingdom. All content available under the Open Government Licence v3.0.
            </p>
            <div className="flex gap-2">
              {["X", "FB", "YT", "LI"].map((s) => (
                <a key={s} href="#" className="w-7 h-7 bg-[#461e29] hover:bg-[#5e2535] text-[#ebbdca] text-[10px] font-bold flex items-center justify-center transition-colors">
                  {s}
                </a>
              ))}
            </div>
          </div>

          {[
            {
              title: "Services",
              links: ["National ID Card", "Passport", "Driving Licence", "Birth Certificate", "Marriage Certificate", "Death Registration"],
            },
            {
              title: "Organisation",
              links: ["About GSTK", "Executive Leadership", "Our Departments", "Annual Reports", "Transparency Data", "Careers"],
            },
            {
              title: "Support",
              links: ["Contact Us", "Find a Service Centre", "Complaints Procedure", "Freedom of Information", "Accessibility Statement", "Cookies Policy"],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-[#ebbdca] font-semibold text-xs tracking-widest uppercase mb-3 pb-2 border-b border-[#461e29]">{col.title}</h4>
              <ul className="space-y-1.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-[#d4849a]/60 hover:text-[#ebbdca] transition-colors text-xs">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[#461e29]/40 py-4 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-[#d4849a]/40">
            <span>© 2026 GSTK, All rights reserved</span>
            <div className="flex gap-4">
              {["Privacy Policy", "Terms of Use", "Accessibility", "Sitemap"].map((l) => (
                <a key={l} href="#" className="hover:text-[#d4849a] transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
