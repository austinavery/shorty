import React from "react";

type Status =
  | {
      type: "None";
    }
  | {
      type: "Loading";
    }
  | {
      type: "Error";
      message: string;
    }
  | {
      type: "Success";
    };

const URLStatus: React.FC<{ status: Status }> = ({ status }) => {
  switch (status.type) {
    case "None":
      return null;
    case "Error":
      return <>{status.message}</>;
    case "Loading":
      return <>Loading...</>;
    case "Success":
      return <>{"Success!"}</>;
  }
};

export const App: React.FC = () => {
  const [fullURL, setFullURL] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<Status>({ type: "None" });

  const onSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!fullURL) {
      setStatus({ type: "Error", message: "Please enter a full URL." });
    }

    setStatus({ type: "Loading" });

    try {
      const response = await fetch("/api/shorty", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullURL }),
      });

      if (response.ok) {
        const json = await response.json();
        console.log({ json });
        setStatus({ type: "Success" });

        return;
      }

      setStatus({ type: "Error", message: "Failed to save." });
    } catch {
      setStatus({ type: "Error", message: "Something went wrong." });
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <URLStatus status={status} />
      <label htmlFor="url">URL:</label>
      <input
        type="text"
        id="url"
        name="URL"
        onChange={(e) => setFullURL(e.target.value)}
      />
      <button type="submit" onClick={onSubmit}>
        Shortify!
      </button>
    </form>
  );
};
