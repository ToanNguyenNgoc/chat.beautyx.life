import AppProvider from "src/AppProvider";
import RouterConfig from "./router";

export default function App() {
  return (
    <AppProvider>
      <RouterConfig />
    </AppProvider>
  );
}
