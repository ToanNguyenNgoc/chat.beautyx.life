import RouterConfig from "./router";
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "src/configs";
import AppProvider from "src/context/AppProvider";



export default function App() {
  return (
    <QueryClientProvider client={queryClient} >
      <AppProvider>
        <RouterConfig />
      </AppProvider>
    </QueryClientProvider>
  );
}
