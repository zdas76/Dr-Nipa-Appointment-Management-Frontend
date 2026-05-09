import { Box, Typography } from "@mui/material";
import CreateConnectorForm from "../../../component/connector/CreateConnectorForm";
import BasicModal from "../../../component/Modal/BasicModel";

export default function ConnectorManagement() {
    return (
        <Box>
            <Box sx={{ p: 2, bgcolor: "white", borderRadius: 3, display: "flex", gap: 2, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: 20, fontWeight: 500 }}>Connector Management</Typography>

                <BasicModal buttonLabel="Add Connector">
                    <CreateConnectorForm />
                </BasicModal>
            </Box>

            <Box sx={{ mt: 3 }}>
                {/* Table or List of Connectors will go here */}
            </Box>
        </Box>
    );
}
