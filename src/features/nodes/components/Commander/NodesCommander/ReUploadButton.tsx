import { useAppSelector } from "@/app/hooks";
import PanelContext from "@/contexts/PanelContext";
import { PanelMode } from "@/types";
import { ActionIcon, FileButton, Loader, Tooltip } from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
import { useContext} from "react";
import { useDispatch } from "react-redux";
import { reUploadFile } from "@/features/nodes/reUploadFile";
import { selectCurrentNodeID } from "@/features/ui/uiSlice";
import { AppDispatch } from "@/app/types";
import { useDisclosure } from "@mantine/hooks";
import { apiSlice } from "@/features/api/slice";

const MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/tif",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv"
].join(",");

export default function ReuploadButton() {
  const [_opened, {open, close}] = useDisclosure(false);

  const mode: PanelMode = useContext(PanelContext)
  const folderID = useAppSelector(s => selectCurrentNodeID(s, mode))

  if (!folderID) {
    return <Loader size={"xs"} />
  }
  const dispatch = useDispatch<AppDispatch>();

  const docID = useAppSelector(s => selectCurrentNodeID(s, mode)); // Fetch the node to reupload the file

  const onReupload = async (file: File | null) => {
    if (!file) {
      console.error("Empty array for uploaded files");
      return;
    }

    if (!docID) {
      console.error("docId not found");
      return;
    }

    console.log("initial test pass.", docID);
    
    try {
      open()
      const result = await dispatch(
        reUploadFile({
          file: file, // File object
          documentId: docID,
          target: null,
        })
      )
      .unwrap()
      .then(() => {
        dispatch(apiSlice.util.invalidateTags([
          {type: "Document", id: docID},
          {type: "DocumentCFV", id: docID}
        ]))
      })
      close()
      //  state.entities[targetDocVerID].pages = newPages
      console.log("Reupload successful:", result);
    } catch (error) {
      console.error("Reupload failed:", error);
    }
  };

  return (
    <FileButton onChange={onReupload} accept={MIME_TYPES} multiple={false}>
      {(props) => (
        <Tooltip label="Re-upload" withArrow>
          <ActionIcon {...props} size="lg" variant="default">
            <IconUpload stroke={1.4} />
          </ActionIcon>
        </Tooltip>
      )}
    </FileButton>
  );
}