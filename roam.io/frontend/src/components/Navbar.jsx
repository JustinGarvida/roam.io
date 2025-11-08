import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import mainLogo from "../assets/main_logo.png";
import { supabase } from "../services/supabaseClient";

function NavBar() {
  let [user, setUser] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    let fetchUser = async () => {
      let { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();

    let { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/login");
  };
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src={mainLogo}
            alt="Logo"
            style={{
              height: "40px",
              width: "auto",
              objectFit: "contain",
            }}
            className="me-2"
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto align-items-center">
            {!user ? (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Button
                  as={Link}
                  to="/signup"
                  variant="primary"
                  className="ms-3"
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/home">
                  Dashboard
                </Nav.Link>
                <Button
                  variant="outline-light"
                  className="ms-3"
                  onClick={handleLogout}
                >
                  Sign Out
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
