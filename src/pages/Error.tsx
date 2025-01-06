import {useRouteError, useNavigate} from "react-router-dom"
import {Button} from "@mantine/core"

interface RouteError {
  data: string
  error: {
    columnNumber: number
    fileName: string
    lineNumber: number
    message: string
    stack: string
  }
  internal: boolean
  status: number
  statusText: string
}

export default function PageNotFound() {
  const error = useRouteError() as RouteError;
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/login'); // Redirect to login page
  };

  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
      <Button variant="submit" onClick={handleRedirect}>
          Return to  Login
          </Button>
      </p>

    </div>
  );
}