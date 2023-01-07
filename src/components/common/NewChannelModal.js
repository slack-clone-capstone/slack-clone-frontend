import { Box, Modal, Switch, Typography } from "@mui/material";

const NewChannelModal = ({
  channelOpen,
  handleClose,
  submitNewChannel,
  newChannelName,
  setNewChannelName,
  newChannelDescription,
  setNewChannelDescription,
  newChannelPrivate,
  editChannelPrivate,
}) => {
  return (
    <Modal
      open={channelOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="Modal-new-chat">
        <Typography variant="h6" component="h2">
          Create a channel
        </Typography>
        <form onSubmit={submitNewChannel}>
          <label>
            <Typography sx={{ mt: 2 }}>New channel name:</Typography>
            <input
              name="channel-name"
              type="text"
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
            />
          </label>
          <label>
            <Typography sx={{ mt: 2 }}>Description:</Typography>
            <input
              name="channel-description"
              type="text"
              value={newChannelDescription}
              onChange={(e) => setNewChannelDescription(e.target.value)}
            />
          </label>
          <label>
            <Typography sx={{ mt: 2 }}>Make private?</Typography>
            <Switch
              checked={newChannelPrivate}
              onChange={editChannelPrivate}
              inputProps={{ "aria-label": "controlled" }}
            />
          </label>
          <br />
          <input type="submit" value="Create channel" />
        </form>
      </Box>
    </Modal>
  );
};

export default NewChannelModal;
