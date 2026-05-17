import { Box, Divider, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import BasicModal from "../../../component/Modal/BasicModel";
import UpdateModal from "../../../component/Modal/UpdateModal";
import CreateConnectorForm from "../../../component/connector/CreateConnectorForm";
import UpdateConnectorForm from "../../../component/connector/UpdateConnectorForm";
import { useDeleteConnectorMutation, useGetAllConnectorQuery } from "../../../redux/api/connectorAPI";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import { useState } from "react";
import { getResponse } from "../../../utils/getResponst";
import type { TConnector } from "../../../types/User";
import { Link } from "react-router";

export default function ConnectorManagement() {
  const { data: connectors, isLoading } = useGetAllConnectorQuery(undefined, { refetchOnMountOrArgChange: true });
  const [deleteConnector] = useDeleteConnectorMutation();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedConnector, setSelectedConnector] = useState<TConnector | null>(null);

  const handleEdit = (connector: TConnector) => {
    setSelectedConnector(connector);
    setEditModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this connector?")) {
      const res = await deleteConnector(id);
      getResponse(res);
    }
  };

  return (
    <Box>
      <Box sx={{ p: 2, bgcolor: "white", borderRadius: 3, display: "flex", gap: 2, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Typography sx={{ fontSize: 20, fontWeight: 500 }}>Connector Management</Typography>

        <BasicModal buttonLabel="Add Connector">
          <CreateConnectorForm onCancel={() => { }} />
        </BasicModal>
      </Box>

      <Divider />

      <Box sx={{ mt: 3 }}>
        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>SL</TableCell>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="left">Contact Number</TableCell>
                  <TableCell align="left">Diagnostic Name</TableCell>
                  <TableCell align="center">New Patient (Fee)</TableCell>
                  <TableCell align="center">Old Patient (Fee)</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {connectors?.data?.map((row: TConnector, index: number) => (
                  <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align="left">{index + 1}</TableCell>
                    <TableCell align="left" component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="left">{row.contactNumber}</TableCell>
                    <TableCell align="left">{row.diagnosticName || "N/A"}</TableCell>
                    <TableCell align="center">{row.newPatientAmount}</TableCell>
                    <TableCell align="center">{row.oldPatientAmount}</TableCell>
                    <TableCell align="center">
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
        )}
      </Box>

      <UpdateModal
        open={editModalOpen}
        handleClose={() => setEditModalOpen(false)}
      >
        {selectedConnector && (
          <UpdateConnectorForm
            data={selectedConnector}
            onCancel={() => setEditModalOpen(false)}
          />
        )}
      </UpdateModal>
    </Box>
  );
}
