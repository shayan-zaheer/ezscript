import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import HomePage from './pages/HomePage.jsx';
import EditPage from './pages/EditPage.jsx';
import "./App.css";
import 'react-toastify/dist/ReactToastify.css';

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />
    },
    {
        path: "/editor/:roomID",
        element: <EditPage />
    }
]);

createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)
