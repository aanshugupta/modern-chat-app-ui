import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';

interface RenameGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  onRename: (newName: string) => void;
}

const RenameGroupModal: React.FC<RenameGroupModalProps> = ({ isOpen, onClose, currentName, onRename }) => {
  const [newName, setNewName] = useState(currentName);

  useEffect(() => {
    if (isOpen) {
      setNewName(currentName);
    }
  }, [isOpen, currentName]);

  const handleSubmit = () => {
    if (newName.trim() && newName.trim() !== currentName) {
      onRename(newName.trim());
      onClose();
    } else if (newName.trim() === currentName) {
        onClose(); // Just close if name is the same
    } else {
        alert("Group name cannot be empty.");
    }
  };

  const footer = (
    <>
      <Button variant="secondary" onClick={onClose}>Cancel</Button>
      <Button onClick={handleSubmit}>Save</Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rename Group" footer={footer}>
      <div className="space-y-4">
        <Input
          label="Group Name"
          id="group-name-rename"
          placeholder="Enter new group name..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          required
        />
      </div>
    </Modal>
  );
};

export default RenameGroupModal;