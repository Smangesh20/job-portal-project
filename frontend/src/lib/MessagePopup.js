import { Snackbar, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

const MessagePopup = (props) => {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    props.setOpen(false);
  };
  return (
    <Snackbar open={props.open} onClose={handleClose} autoHideDuration={3000}>
      <Alert onClose={handleClose} severity={props.severity}>
        <Typography variant="body2">{props.message}</Typography>
        {props.correlationId ? (
          <Typography variant="caption">Reference: {props.correlationId}</Typography>
        ) : null}
      </Alert>
    </Snackbar>
  );
};

export default MessagePopup;
