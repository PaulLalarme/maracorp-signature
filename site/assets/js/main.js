const form = document.getElementById("sigForm");
const preview = document.getElementById("preview");
const codeEl = document.getElementById("code");

function escapeHtml(s = "") {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[
        c
      ])
  );
}

function buildSignature(data) {
  const c = data.couleur || "#C41D1D";
  const fullName = [data.prenom, data.nom].filter(Boolean).join(" ");

  // icons as text for compatibility
  const icFix = "☎️";
  const icPhone = "📱";
  const icPin = "📌";
  const icMail = "📧";
  const icWeb = "🌐";

  // TABLE LAYOUT + INLINE STYLES (safe for most clients)
  return (
    `<!-- Signature générée -->\n` +
    `<table cellpadding="0" cellspacing="0" style="font-family: Arial, Helvetica, sans-serif; font-size:14px; color:#0f172a; line-height:1.4">` +
    `<tr>` +
    `<td style="padding:12px 16px 12px 0;">` +
    `<div style="font-weight:bold; font-size:16px;">${escapeHtml(
      fullName
    )}</div>` +
    (data.fonction
      ? `<div style="color:#475569; font-size:12px;">${escapeHtml(
          data.fonction
        )}${data.entreprise ? ` · ${escapeHtml(data.entreprise)}` : ""}</div>`
      : "") +
    `<div style="height:8px"></div>` +
    `<table cellpadding="0" cellspacing="0" style="font-size:13px; color:#0f172a">` +
    (data.tel
      ? `<tr><td style="padding:2px 10px 2px 0">${icPhone}</td><td>${escapeHtml(
          data.tel
        )}</td></tr>`
      : "") +
      (data.fixe
      ? `<tr><td style="padding:2px 10px 2px 0">${icFix}</td><td>${escapeHtml(
          data.fixe
        )}</td></tr>`
      : "") +
    (data.adresse
      ? `<tr><td style="padding:2px 10px 2px 0">${icPin}</td><td>${escapeHtml(
          data.adresse
        )}</td></tr>`
      : "") +
    (data.email
      ? `<tr><td style="padding:2px 10px 2px 0">${icMail}</td><td><a href="mailto:${escapeHtml(
          data.email
        )}" style="color:${c}; text-decoration:none">${escapeHtml(
          data.email
        )}</a></td></tr>`
      : "") +
    (data.site
      ? `<tr><td style="padding:2px 10px 2px 0">${icWeb}</td><td><a href="${escapeHtml(
          data.site.startsWith("http") ? data.site : "https://" + data.site
        )}" style="color:${c}; text-decoration:none">${escapeHtml(
          data.site
        )}</a></td></tr>`
      : "") +
    `</table>` +
    `<img src="/assets/images/FormagraphLogo.jpg" alt="logo" style="display:block; width:110px; padding-top: 1rem; height:auto; border:0" />`
    +
    `<div style="margin-top:10px; color:#64748b; font-size:11px; max-width:520px;"><p>ÉCOLE DE GRAPHISME <br/> FORMATION EN COMMUNICATION GRAPHIQUE ET DIGITAL</p></div>`
    +
    (data.mentions
      ? `<div style="margin-top:10px; color:#64748b; font-size:11px; max-width:520px;">${escapeHtml(
          data.mentions
        )}</div>`
      : "") +
    `</td>` +
    `<td style="padding:12px 0 12px 16px; vertical-align:top">` +
     `<div style="display: flex;">
        <img src="/assets/images/LogoQualiopi.jpg" alt="logo Qualiopi" style="display:block; width:200px; height:auto; border:0" />       
        <img src="/assets/images/ACTlogo.jpg" alt="logo ACT" style="display:block; width:200px; height:80px; border:0" />
      </div>
      <img src="/assets/images/RNCP_Datadock_CPF_TosaLogos.png" alt="logo" style="display:block; width:300px; height:auto; border:0" />`
      +
    `</td>` +
    `</tr>` +
    `</table>`
  );
}

function getData() {
  const fd = new FormData(form);
  const obj = Object.fromEntries(fd.entries());
  return obj;
}

function generate() {
  const sig = buildSignature(getData());

  // Preview
  preview.innerHTML = sig;

  // Code block
  codeEl.textContent = sig;
}

async function copyHtml() {
  try {
    await navigator.clipboard.writeText(codeEl.textContent);
    toast("Code HTML copié ✔");
  } catch (e) {
    alert("Impossible de copier automatiquement. Copiez manuellement le code.");
  }
}

async function copyRich() {
  const html = preview.innerHTML;
  try {
    if (navigator.clipboard && window.ClipboardItem) {
      const data = new ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([html.replace(/<[^>]+>/g, "")], {
          type: "text/plain",
        }),
      });
      await navigator.clipboard.write([data]);
    } else {
      // fallback: open a tiny window to select-copy
      const w = window.open("", "", "width=600,height=400");
      if (w) {
        w.document.write(html);
        w.document.close();
        w.getSelection().selectAllChildren(w.document.body);
      }
    }
    toast("Signature copiée (riche) ✔");
  } catch (e) {
    alert("Copie riche non supportée par ce navigateur.");
  }
}

function toast(msg) {
  const t = document.createElement("div");
  t.textContent = msg;
  t.style.cssText =
    "position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:#111827; color:#fff; padding:10px 14px; border-radius:12px; z-index:9999; box-shadow:0 6px 22px rgba(0,0,0,.25); font-weight:600";
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1700);
}

// Bind
document.getElementById("genBtn").addEventListener("click", generate);
document.getElementById("copyHtml").addEventListener("click", copyHtml);
document.getElementById("copyRich").addEventListener("click", copyRich);

// Demo defaults
(function seed() {
  document.getElementById("prenom").value = "";
  document.getElementById("nom").value = "";
  document.getElementById("fonction").value = "";
  document.getElementById("tel").value = "";
  document.getElementById("fixe").value = "";
  document.getElementById("adresse").value =
    "";
  document.getElementById("email").value = "";
  document.getElementById("site").value = "";
  document.getElementById("logo").value = "";
  document.getElementById("couleur").value = "#C41D1D";
  generate();
})();
