import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';
import PopupModal from '@components/PopupModal';
import {
  chatToMarkdown,
  downloadImg,
  downloadMarkdown,
  // downloadPDF,
  htmlToImg,
} from '@utils/chat';
import ImageIcon from '@icon/ImageIcon';
import PdfIcon from '@icon/PdfIcon';
import MarkdownIcon from '@icon/MarkdownIcon';
import JsonIcon from '@icon/JsonIcon';
import axios from 'axios'
import downloadFile from '@utils/downloadFile';

const uploadChatSession = async (chat: any, uploadKey: string| undefined) => {
    const URL = `https://bangerapi.danksy.app/upload/${chat.title}`
  

    const uploadBody = {
      original_model: chat.config.model,
      messages: chat.messages,
      temperature: chat.config.temperature,
      // presence_penalty: chat.config.presence_penalty,
      // frequency_penalty: chat.config.presence_penalty,
    }
    console.dir(uploadBody)
try {
  const response = await axios.post(URL, uploadBody, {
    headers: {
      'upload-key': uploadKey || '',
      'Content-Type': 'application/json'
    }
  });
  console.log('Upload successful:', response.data);
} catch (error) {
  console.error('Failed to upload chat session:', error);
}



}


const DownloadChat = React.memo(
  ({ saveRef }: { saveRef: React.RefObject<HTMLDivElement> }) => {


    const uploadKey = useStore((state) => state.uploadKey);

    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    return (
      <>
        <button
          className='btn btn-neutral'
          // aria-label={t('downloadChat') as string}
          aria-label={'export chat session'}
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          {/* {t('downloadChat')} */}
          {'export chat session'}
        </button>
        {isModalOpen && (
          <PopupModal
            setIsModalOpen={setIsModalOpen}
            // title={t('downloadChat') as string}
            title={'export chat session'}
            cancelButton={false}
          >
            <div className='p-6 border-b border-gray-200 dark:border-gray-600 flex gap-4'>
            
              <button
                className='btn btn-neutral gap-2'
                aria-label='json'
                onClick={async () => {
                  const chats = useStore.getState().chats;
                  if (chats) {
                    const chat = chats[useStore.getState().currentChatIndex];
                    console.dir(chat)
                    console.log(chat.title)
                    await uploadChatSession(chat, uploadKey)
                    downloadFile([chat], chat.title);
                  }
                }}
              >
                <JsonIcon />
                JSON
              </button>
            </div>
          </PopupModal>
        )}
      </>
    );
  }
);

export default DownloadChat;
