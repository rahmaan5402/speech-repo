import Create from "@/pages/Create";
import Home from "@/pages/Home";
import List from "@/pages/List";
import { RouteObject } from 'react-router-dom';

const router: RouteObject[] = [
    {
        path: '/',
        element: <Home />,
        children: [
            {
                index: true,
                element: <List />
            },
            {
                path: '/create',
                element: <Create />
            }
        ]
    }
];

export default router;