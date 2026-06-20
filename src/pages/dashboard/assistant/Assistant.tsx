import { Box, Divider, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import CreateAssistantForm from "../../../component/assistant/CreateAssistantForm";
import UpdateAssistantForm from "../../../component/assistant/UpdateAssistantForm";
import BasicModal from "../../../component/Modal/BasicModel";
import UpdateModal from "../../../component/Modal/UpdateModal";
import { useDeleteAssistantMutation, useGetAllAssistantQuery } from "../../../redux/api/assistantAPI";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import { useState } from "react";
import { getResponse } from "../../../utils/getResponst";
import type { TAssistant } from "../../../types/User";
import { Link } from "react-router";

export default function AssistantManagement() {

  const { data } = useGetAllAssistantQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [deleteAssistant] = useDeleteAssistantMutation();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState<TAssistant | null>(null);


  const handleEdit = (assistant: TAssistant) => {
    setSelectedAssistant(assistant);
    setEditModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this assistant?")) {
      const res = await deleteAssistant(id);
      getResponse(res);
    }
  };

  return (
    <Box>
      <Box sx={{ p: 2, bgcolor: "white", borderRadius: 3, display: "flex", gap: 2, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Typography sx={{ fontSize: 20, fontWeight: 500 }}>Assistant Management</Typography>

        <BasicModal buttonLabel="Add Assistant">
          <CreateAssistantForm />
        </BasicModal>
      </Box>

      <Divider />
      <Box sx={{ mt: 3 }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>SL</TableCell>
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Email</TableCell>
                <TableCell align="left">Father's Name</TableCell>
                <TableCell align="left">Mother's Name</TableCell>
                <TableCell align="left">Date Of Birth</TableCell>
                <TableCell align="left">Contact Number</TableCell>
                <TableCell align="left">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.data?.map((row: TAssistant, index: number) => (
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="left">{index + 1}</TableCell>
                  <TableCell align="left" component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="left">{row.email}</TableCell>
                  <TableCell align="left">{row.fatherName}</TableCell>
                  <TableCell align="left">{row.motherName}</TableCell>
                  <TableCell align="left">{row.dateOfBirth}</TableCell>
                  <TableCell align="left">{row.contactNumber}</TableCell>
                  <TableCell align="left">
                    <Stack direction="row" sx={{ alignItems: "center", justifyContent: "center", gap: 2 }}>
                      <Link to={`${row.id}`}>
                        <Visibility
                          color="primary"
                          sx={{ cursor: "pointer" }}
                        />
                      </Link>
                      <Edit
                        color="primary"
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleEdit(row)}
                      />
                      <Delete
                        color="error"
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleDelete(row.id!)}
                      />
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Table or List of Assistants will go here */}
      </Box>

      {/* Edit Modal */}
      <UpdateModal
        open={editModalOpen}
        handleClose={() => setEditModalOpen(false)}
      >
        {selectedAssistant && (
          <UpdateAssistantForm
            data={selectedAssistant}
            onCancel={() => setEditModalOpen(false)}
          />
        )}
      </UpdateModal>

    </Box>
  );
}
