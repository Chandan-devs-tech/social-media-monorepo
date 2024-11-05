import Link from "next/link";

export default function HomePage() {
  return (
    <div style={{ textAlign: "center", paddingTop: "100px" }}>
      <h1>Welcome to Social Media App</h1>
      <div style={{ marginTop: "20px" }}>
        <Link href="/login">
          <button
            style={{
              margin: "10px",
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Sign In
          </button>
        </Link>
        <Link href="/register">
          <button
            style={{
              margin: "10px",
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
}
