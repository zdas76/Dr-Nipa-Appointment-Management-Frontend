import { Box, Typography } from "@mui/material";
import BasicModal from "../../../component/Modal/BasicModel";
import CreatePatientForm from "../../../component/Patient/CreatePatientForm";

export default function PatientManagement() {
  return (
    <Box>
      <Box sx={{ p: 2, bgcolor: "white", borderRadius: 3, display: "flex", gap: 2, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Typography sx={{ fontSize: 20, fontWeight: 500 }}>Patient Management</Typography>
        
        <BasicModal buttonLabel="Add Patient">
          <CreatePatientForm />
        </BasicModal>
      </Box>
      
      <Box sx={{ mt: 3 }}>
        {/* Table or List of Patients will go here */}
      </Box>
    </Box>
  );
}
