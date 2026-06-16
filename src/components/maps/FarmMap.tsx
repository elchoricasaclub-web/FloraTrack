export default function FarmMap() {
  const genetics = [
    {
      code: "GL-001",
      variety: "Tikuna",
      type: "THC",
      status: "Activa",
    },
    {
      code: "GL-002",
      variety: "Tikuna CBD",
      type: "CBD",
      status: "Activa",
    },
    {
      code: "GL-003",
      variety: "CHC Medicinal",
      type: "THC",
      status: "Registro",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">
        🧬 Banco Genético
      </h2>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="p-3">Código</th>
            <th className="p-3">Variedad</th>
            <th className="p-3">Tipo</th>
            <th className="p-3">Estado</th>
          </tr>
        </thead>

        <tbody>
          {genetics.map((item) => (
            <tr key={item.code} className="border-b">
              <td className="p-3">{item.code}</td>
              <td className="p-3">{item.variety}</td>
              <td className="p-3">{item.type}</td>
              <td className="p-3">{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}