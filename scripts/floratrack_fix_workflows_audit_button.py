from pathlib import Path
from datetime import datetime
import shutil

ROOT = Path.cwd()
STAMP = datetime.now().strftime("%Y%m%d-%H%M%S")
BACKUP_DIR = Path("/home/usergrowlifecol/floratrack_backups") / f"fix-workflows-audit-button-{STAMP}"

WORKFLOWS = ROOT / "src/app/workflows/page.tsx"

BACKUP_DIR.mkdir(parents=True, exist_ok=True)
shutil.copy2(WORKFLOWS, BACKUP_DIR / "page.workflows.before-fix.tsx")

text = WORKFLOWS.read_text()
lines = text.splitlines()

# 1. Eliminar cualquier boton de tarjeta mal insertado:
#    onClick={() => handleCreateAuditDraft(record, true)}
new_lines = []
i = 0
removed_blocks = 0

while i < len(lines):
    line = lines[i]

    if "handleCreateAuditDraft(record, true)" in line:
        start = i
        while start >= 0 and "<button" not in lines[start]:
            start -= 1

        end = i
        while end < len(lines) and "</button>" not in lines[end]:
            end += 1

        if start >= 0 and end < len(lines):
            # Elimina lineas ya agregadas desde new_lines.
            keep_until = len(new_lines) - (i - start)
            if keep_until < 0:
                keep_until = 0
            new_lines = new_lines[:keep_until]
            i = end + 1
            removed_blocks += 1
            continue

    new_lines.append(line)
    i += 1

lines = new_lines

audit_card_button = [
    '                        <button type="button" onClick={() => handleCreateAuditDraft(record, true)} className="rounded-xl border border-emerald-300/50 px-3 py-2 text-xs font-black text-emerald-100 hover:bg-emerald-500/10">',
    '                          Audit Trail',
    '                        </button>',
]

# 2. Insertar el boton Audit Trail en una zona valida del card:
#    despues del bloque condicional de Editar.
already_inserted = any("handleCreateAuditDraft(record, true)" in ln for ln in lines)

inserted = False

if not already_inserted:
    for idx, line in enumerate(lines):
        window_start = max(0, idx - 6)
        window_end = min(len(lines), idx + 8)
        window = "\n".join(lines[window_start:window_end])

        is_edit_button = (
            "Editar" in window
            and ("handleEdit(record)" in window or "onEdit(record)" in window)
            and "<button" in window
        )

        if not is_edit_button:
            continue

        # Encuentra el cierre del boton Editar.
        close_idx = idx
        while close_idx < len(lines) and "</button>" not in lines[close_idx]:
            close_idx += 1

        if close_idx >= len(lines):
            continue

        # Si el boton Editar estaba dentro de {condicion && (...)},
        # insertar despues del cierre ")}", no dentro del parentesis.
        insert_after = close_idx
        scan = close_idx + 1
        while scan < min(len(lines), close_idx + 6):
            stripped = lines[scan].strip()
            if stripped == ")}" or stripped == ")};":
                insert_after = scan
                break
            if stripped and stripped not in {"", ")"}:
                break
            scan += 1

        lines[insert_after + 1:insert_after + 1] = audit_card_button
        inserted = True
        break

# 3. Confirmar que el boton del formulario exista.
form_button_exists = any("handleCreateAuditDraft(form, true)" in ln for ln in lines)

# 4. Si no se pudo insertar el boton de tarjeta, no se rompe el archivo:
#    el formulario aun tendra Enviar a Audit Trail.
fixed_text = "\n".join(lines) + "\n"
WORKFLOWS.write_text(fixed_text)

print("FIX COMPLETADO")
print(f"Backup: {BACKUP_DIR}")
print(f"Botones de tarjeta mal insertados removidos: {removed_blocks}")
print(f"Boton Audit Trail de tarjeta insertado correctamente: {'SI' if inserted or already_inserted else 'NO'}")
print(f"Boton Enviar a Audit Trail en formulario existe: {'SI' if form_button_exists else 'NO'}")
