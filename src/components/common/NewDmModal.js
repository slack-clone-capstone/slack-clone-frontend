import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Modal,
  Typography,
} from "@mui/material";

const NewDmModal = ({
  dMOpen,
  handleDMClose,
  submitNewDM,
  usersList,
  updateChecks,
}) => {
  return (
    <Modal
      open={dMOpen}
      onClose={handleDMClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="Modal-new-chat">
        <Typography variant="h6" component="h2">
          Add users to direct message:
        </Typography>
        <form onSubmit={submitNewDM}>
          <FormGroup>
            {usersList?.map((userItem, index) => (
              <FormControlLabel
                // className="twocolelement"
                key={index}
                control={
                  <Checkbox
                    onChange={updateChecks}
                    index={index}
                    id={userItem.id.toString()}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label={
                  userItem.firstName +
                  " " +
                  userItem.lastName +
                  " " +
                  userItem.username
                }
              />
            ))}
          </FormGroup>

          <br />
          <input type="submit" value="New conversation" />
        </form>
      </Box>
    </Modal>
  );
};
export default NewDmModal;
