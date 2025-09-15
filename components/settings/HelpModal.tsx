import React from 'react';
import Modal from '../common/Modal';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FAQItem: React.FC<{question: string, children: React.ReactNode}> = ({ question, children }) => (
    <details className="p-4 rounded-lg bg-slate-100 dark:bg-slate-700/50 cursor-pointer">
        <summary className="font-semibold">{question}</summary>
        <div className="mt-2 text-slate-600 dark:text-slate-300">
            {children}
        </div>
    </details>
)

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Help & Support">
        <div className="space-y-4">
            <div>
                <h3 className="font-bold mb-2">Frequently Asked Questions</h3>
                <div className="space-y-2">
                    <FAQItem question="How do I start a new chat?">
                        <p>Click the plus icon (+) in the 'Chats' section of the sidebar. You can then select one or more people to start a direct message or a group chat.</p>
                    </FAQItem>
                    <FAQItem question="How can I change my profile picture?">
                        <p>Click your profile at the bottom of the sidebar, then click 'Edit Profile'. You can upload a new photo by clicking the camera icon on your current picture.</p>
                    </FAQItem>
                    <FAQItem question="Is this application secure?">
                        <p>This is a demonstration application. While we strive to follow best practices, please do not use real sensitive information.</p>
                    </FAQItem>
                </div>
            </div>
            <div>
                <h3 className="font-bold mb-2">Contact Us</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                    If you need further assistance, please reach out to our support team at <a href="mailto:support@example.com" className="text-blue-500 hover:underline">support@example.com</a>.
                </p>
            </div>
        </div>
    </Modal>
  );
};

export default HelpModal;