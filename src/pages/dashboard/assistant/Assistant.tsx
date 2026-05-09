import { Box, Typography } from "@mui/material";
import CreateAssistantForm from "../../../component/assistant/CreateAssistantForm";
import BasicModal from "../../../component/Modal/BasicModel";

export default function AssistantManagement() {
  return (
    <Box>
      <Box sx={{ p: 2, bgcolor: "white", borderRadius: 3, display: "flex", gap: 2, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Typography sx={{ fontSize: 20, fontWeight: 500 }}>Assistant Management</Typography>

        <BasicModal buttonLabel="Add Assistant">
          <CreateAssistantForm />
        </BasicModal>
      </Box>

      <Box sx={{ mt: 3 }}>
        {/* Table or List of Assistants will go here */}
      </Box>
    </Box>
  );
}
