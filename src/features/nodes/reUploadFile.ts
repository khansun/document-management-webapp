import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { uploaderFileItemUpdated } from "@/features/ui/uiSlice";
import type { FolderType, NodeType } from "@/types";
import { getBaseURL, getDefaultHeaders } from "@/utils";

type ReUploadFileInput = {
  file: File;
  documentId: string; // ID of the document to re-upload
  target: FolderType | null;
};

type ReUploadFileOutput = {
  source: NodeType | null;
  file_name: string;
  target: FolderType | null;
};

export const reUploadFile = createAsyncThunk<ReUploadFileOutput, ReUploadFileInput>(
  "/re-upload",
  async (args: ReUploadFileInput, thunkApi) => {
    const baseUrl = getBaseURL();
    const defaultHeaders = getDefaultHeaders();

    const { file, documentId } = args;
    console.log("Base url:", baseUrl);
    console.log("DFH:", defaultHeaders);

    // Dispatch "uploading" state
    thunkApi.dispatch(
      uploaderFileItemUpdated({
        item: {
          source: null,
          target: null,
          file_name: file.name,
        },
        status: "uploading",
        error: null,
      })
    );
    console.log("Processed..")
    // Prepare upload URL
    const uploadURL = `${baseUrl}/api/documents/${documentId}/upload`;
    const form_data = new FormData();
    form_data.append("file", file);
    console.log("Processed.. upload url", uploadURL);
    let response;

    try {
      response = await axios.post(uploadURL, form_data, {
        headers: {
          ...defaultHeaders,
          "Content-Type": "multipart/form-data",
        },
        validateStatus: () => true,
      });
    } catch (error: unknown) {
      console.error(`Error while re-uploading file to ${uploadURL}`);
      console.error(error);
      thunkApi.dispatch(
        uploaderFileItemUpdated({
          item: {
            source: null,
            target: null,
            file_name: file.name,
          },
          status: "failure",
          error: "Re-upload error. See console for details.",
        })
      );

      return {
        file_name: file.name,
        source: null,
        target: null,
      };
    }
    console.log("Processed..")
    // Handle failure response
    if (response.status >= 400) {
      console.error(`Re-upload failed: ${response.status} ${response.statusText}`);
      thunkApi.dispatch(
        uploaderFileItemUpdated({
          item: {
            source: null,
            target: null,
            file_name: file.name,
          },
          status: "failure",
          error: `${response.status} ${response.statusText}: ${response.data?.detail || "Unknown error"}`,
        })
      );

      return {
        file_name: file.name,
        source: null,
        target: null,
      };
    }

    // Success case
    const createdNode = response.data as NodeType;

    thunkApi.dispatch(
      uploaderFileItemUpdated({
        item: {
          source: createdNode,
          target: response.data.target,
          file_name: file.name,
        },
        status: "success",
        error: null,
      })
    );

    return {
      file_name: file.name,
      source: createdNode,
      target: response.data.target,
    };
  }
);