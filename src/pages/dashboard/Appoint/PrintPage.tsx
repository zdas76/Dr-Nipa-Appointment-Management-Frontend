import { useSearchParams } from "react-router";

function formatDate(dateStr: string | null): string {
    if (!dateStr) return "—";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
}

export default function PrintPage() {
    const [searchParams] = useSearchParams();

    const patientId = searchParams.get("patientId") ?? "—";
    const patientName = searchParams.get("patientName") ?? "—";
    const contactNumber = searchParams.get("contactNumber") ?? "—";
    const gender = searchParams.get("gender") ?? "—";
    const age = searchParams.get("age") ?? "—";
    const patientType = searchParams.get("patientType") ?? "—";
    const visitingDate = searchParams.get("visitingDate") ?? null;
    const visitingFee = searchParams.get("visitingFee") ?? "—";
    const visitingTime = searchParams.get("visitingTime") ?? "—";

    const handlePrint = () => window.print();
    const handleCancel = () => window.close();

    return (
        <>
            <style>{`
                * { margin: 0; padding: 0; box-sizing: border-box; }

                body {
                    font-family: 'Roboto', 'Segoe UI', Arial, sans-serif;
                    background: #f5f5f5;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    padding: 10px;
                }

                .print-wrapper {
                    background: white;
                    border-radius: 8px;
                    padding: 4px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }

                .print-box {
                    width: 390px;
                    padding: 4px;
                    background: white;
                }

                .row-stack {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .content-stack { flex: 1; }

                .doctor-name {
                    font-weight: 700;
                    font-size: 16px;
                    letter-spacing: 0.3px;
                    margin-bottom: 2px;
                }

                .designation {
                    font-weight: 700;
                    font-size: 14px;
                    line-height: 1.5;
                    margin-bottom: 6px;
                }

                .divider-custom {
                    border: none;
                    border-top: 1px solid #e0e0e0;
                    margin: 8px 0 8px 0;
                }

                .info-line {
                    font-size: 14px;
                    line-height: 1.5;
                    color: #1a1a1a;
                }

                .info-line strong { font-weight: 600; }

                .actions {
                    margin-top: 20px;
                    display: flex;
                    justify-content: flex-end;
                    gap: 16px;
                }

                .btn {
                    padding: 8px 28px;
                    border: none;
                    border-radius: 4px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background 0.2s, box-shadow 0.2s;
                    letter-spacing: 0.4px;
                    text-transform: uppercase;
                }

                .btn-outline {
                    background: transparent;
                    border: 1px solid #1976d2;
                    color: #1976d2;
                }

                .btn-outline:hover { background: rgba(25,118,210,0.08); }

                .btn-contained {
                    background: #1976d2;
                    color: white;
                    box-shadow: 0 2px 4px rgba(25,118,210,0.3);
                }

                .btn-contained:hover {
                    background: #1565c0;
                    box-shadow: 0 4px 8px rgba(25,118,210,0.4);
                }

                @media print {
                    body { background: white; padding: 0; }
                    .print-wrapper { box-shadow: none; border-radius: 0; padding: 0; }
                    .actions { display: none !important; }
                    .print-box { width: 100%; padding: 2px; }
                }
            `}</style>

            <div className="print-wrapper">
                {/* ─── PRINTABLE AREA ─── */}
                <div className="print-box" id="printableArea">
                    <div className="row-stack">
                        <div className="content-stack">
                            <div className="doctor-name">DR. NAHIDA ISLAM NIPA</div>
                            <div className="designation">
                                Associate Professor & Head of Department
                                <br />
                                Dermatologist, Venereologist & Dermatosurgeon
                                <br />
                                Community Based Medical College Bangladesh
                                <br />
                                Mobile: 01777016179
                            </div>
                            <hr className="divider-custom" />
                            <div className="info-line"><strong>Patient Id:</strong> {patientId}</div>
                            <div className="info-line"><strong>Patient Name:</strong> {patientName}</div>
                            <div className="info-line"><strong>Gender:</strong> {gender}</div>
                            <div className="info-line"><strong>Age:</strong> {age}</div>
                            <div className="info-line"><strong>Patient Type:</strong> {patientType}</div>
                            <div className="info-line"><strong>Visiting Fee:</strong> {visitingFee}</div>
                            <div className="info-line"><strong>Contact Number:</strong> {contactNumber}</div>
                            <div className="info-line"><strong>Visiting Date:</strong> {formatDate(visitingDate)} at {visitingTime}</div>
                        </div>
                    </div>
                </div>

                {/* ─── ACTION BUTTONS ─── */}
                <div className="actions">
                    <button className="btn btn-outline" onClick={handleCancel}>Cancel</button>
                    <button className="btn btn-contained" onClick={handlePrint}>Print</button>
                </div>
            </div>
        </>
    );
}
