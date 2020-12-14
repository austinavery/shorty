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
      shortURL: string;
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
      return (
        <span>
          <a href={status.shortURL}>{`${window.location}${status.shortURL}`}</a>
        </span>
      );
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
        setStatus({ type: "Success", shortURL: json.shortURL });

        return;
      }

      setStatus({ type: "Error", message: "Failed to save." });
    } catch {
      setStatus({ type: "Error", message: "Something went wrong." });
    }
  };

  return (
    <div>
      <header>
        <h1 style={{ marginBottom: 0 }}>Shorty</h1>
        <p style={{ marginTop: 0 }}>A URL shortener.</p>
      </header>
      <form onSubmit={onSubmit} autoComplete="off">
        <div>
          <label htmlFor="url">URL:</label>
        </div>
        <input
          type="text"
          id="url"
          name="URL"
          onChange={(e) => setFullURL(e.target.value)}
        />
        <div>
          {/* TODO: move position of this message based off of `status` value. */}
          <URLStatus status={status} />
        </div>
        <div style={{ paddingTop: 10 }}>
          <button type="submit" onClick={onSubmit}>
            Shortify!
          </button>
        </div>
      </form>
    </div>
  );
};
