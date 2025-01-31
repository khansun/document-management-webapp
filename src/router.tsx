import {createBrowserRouter} from "react-router-dom"

import App from "@/app/App.tsx"
import Folder, {loader as folderLoader} from "@/pages/Folder"
import Home, {loader as homeLoader} from "@/pages/Home"
import Inbox, {loader as inboxLoader} from "@/pages/Inbox"
import { LoginPage } from './pages/Login.page';

import {
  CustomFieldDetails,
  CustomFieldsList
} from "@/features/custom-fields/pages"
import {
  DocumentTypeDetails,
  DocumentTypesList
} from "@/features/document-types/pages"
import {GroupDetails, GroupsList} from "@/features/groups/pages"
import {TagDetails, TagsList} from "@/features/tags/pages"
import {UserDetails, UsersList} from "@/features/users/pages"
import Document from "@/pages/Document"

import {loader as documentLoader} from "@/pages/Document"

import ErrorPage from "@/pages/Error.tsx"

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/home/:folderId",
        element: <Home />,
        loader: homeLoader
      },
      {
        path: "/inbox/:folderId",
        element: <Inbox />,
        loader: inboxLoader
      },
      {
        path: "/folder/:folderId",
        element: <Folder />,
        loader: folderLoader
      },
      {
        path: "/document/:documentId",
        element: <Document />,
        loader: documentLoader
      },
      {
        path: "/tags",
        element: <TagsList />
      },
      {
        path: "/tags/:tagId",
        element: <TagDetails />
      },
      {
        path: "/custom-fields/",
        element: <CustomFieldsList />
      },
      {
        path: "/custom-fields/:customFieldID",
        element: <CustomFieldDetails />
      },
      {
        path: "/document-types/",
        element: <DocumentTypesList />
      },
      {
        path: "/document-types/:documentTypeID",
        element: <DocumentTypeDetails />
      },
      {
        path: "/groups",
        element: <GroupsList />
      },
      {
        path: "/groups/:groupId",
        element: <GroupDetails />
      },
      {
        path: "/users",
        element: <UsersList />
      },
      {
        path: "/users/:userId",
        element: <UserDetails />
      },
      {
        index: true,
        element: <Home />,
        loader: homeLoader
      }
    ]
  }
])

export default router
