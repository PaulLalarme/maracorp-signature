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
  const c = data.couleur || "#0ea5e9";
  const fullName = [data.prenom, data.nom].filter(Boolean).join(" ");

  // icons as text for compatibility
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
    (data.mentions
      ? `<div style="margin-top:10px; color:#64748b; font-size:11px; max-width:520px;">${escapeHtml(
          data.mentions
        )}</div>`
      : "") +
    `</td>` +
    `<td style="padding:12px 0 12px 16px; vertical-align:top">` +
    (data.logo
      ? `<img src="${escapeHtml(
          data.logo
        )}" alt="logo" style="display:block; width:110px; height:auto; border:0" />
        <div style="display: flex;">
            <img src="https://mail.google.com/mail/u/0?ui=2&ik=5da7915c96&attid=0.0.1.2&permmsgid=msg-f:1827034365474188128&th=195aee134a852b60&view=fimg&fur=ip&permmsgid=msg-f:1827034365474188128&sz=s0-l75-ft&attbid=ANGjdJ_c4b1OIheARdD5Z_VBUXbdpb9JqE5_q9IWPE-thPKZVrY1dlEQ0tMwGRDgZ8Ekt9vsX5qzKtRvFy5KY1-VzxIdbt4YKDPvE8yyJoP9COfUTKls97Ord_4kNFg&disp=emb&zw" alt="logo" style="display:block; width:110px; height:auto; border:0" />
            <img src="https://mail.google.com/mail/u/0?ui=2&ik=5da7915c96&attid=0.0.1.3&permmsgid=msg-f:1827034365474188128&th=195aee134a852b60&view=fimg&fur=ip&permmsgid=msg-f:1827034365474188128&sz=s0-l75-ft&attbid=ANGjdJ-oQnDXmXagJ3iTyLh0mCnTjpEJqR8dABrduERNuiiY4Rmx8DCkKmLrQCkxXC6u7RFEoG0NJWYg5FqlHv36uSVTz6esn-jmMGzFSA8Qw4_rJhsB0FnV4tsyYaI&disp=emb&zw" alt="logo" style="display:block; width:110px; height:auto; border:0" />
        </div>
        <img src="https://mail.google.com/mail/u/0?ui=2&ik=5da7915c96&attid=0.0.1.4&permmsgid=msg-f:1827034365474188128&th=195aee134a852b60&view=fimg&fur=ip&permmsgid=msg-f:1827034365474188128&sz=s0-l75-ft&attbid=ANGjdJ8pSvg_g3gXDcM-EE6CcEjLYQyn6OUO1YFDNdW4oMqOrJ5nq5_xmsxb1iTTSIeirQhAJEBNlx6ziNpPgcp_jJxePjVGhlXzHK10T48Vzs4k5P_Pcj4uiIK1tBs&disp=emb&zw" alt="logo" style="display:block; width:250px; height:auto; border:0" />`
      : "") +
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
  document.getElementById("prenom").value = "PRÉNOM";
  document.getElementById("nom").value = "NOM";
  document.getElementById("fonction").value = "Fonction";
  document.getElementById("tel").value = "+33 6 00 00 00 00";
  document.getElementById("adresse").value =
    "Votre adresse – Code postal VILLE";
  document.getElementById("email").value = "prenom.nom@mail.com";
  document.getElementById("site").value = "www.votresite.fr";
  document.getElementById("logo").value = "";
  document.getElementById("couleur").value = "#0ea5e9";
  generate();
})();
