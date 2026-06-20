export default function Dashboard() {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      background: "#020617",
      color: "white"
    }}>
      <h1>Welcome to Dashboard 🎉</h1>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "#ef4444",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >
        Logout
      </button>
    </div>
  );
}