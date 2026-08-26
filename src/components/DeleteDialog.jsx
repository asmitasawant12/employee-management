import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

function DeleteDialog({
  open,
  employee,
  onClose,
  onConfirm,
  loading,
  type = "employee",
}) {
  const isClearAll = type === "clearAll";

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      aria-labelledby="delete-dialog-title"
    >
      <DialogTitle id="delete-dialog-title">
        {isClearAll ? "Clear All Employees?" : "Delete Employee?"}
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          {isClearAll ? (
            <>
              Are you sure you want to delete all employees? This action
              cannot be undone.
            </>
          ) : (
            <>
              Are you sure you want to delete{" "}
              <strong>{employee?.name}</strong>? This action cannot be
              undone.
            </>
          )}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>

        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={loading}
        >
          {loading
            ? isClearAll
              ? "Clearing..."
              : "Deleting..."
            : isClearAll
            ? "Clear All"
            : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDialog;