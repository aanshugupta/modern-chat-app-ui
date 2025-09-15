import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { PlusIcon } from '../icons/Icons';

interface CreatePollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePoll: (pollData: { question: string, options: {id: string, text: string, votes: string[]}[] }) => void;
}

const CreatePollModal: React.FC<CreatePollModalProps> = ({ isOpen, onClose, onCreatePoll }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<{id: string, text: string}[]>([
    { id: `opt-${Date.now()}-1`, text: '' },
    { id: `opt-${Date.now()}-2`, text: '' },
  ]);

  const handleOptionChange = (id: string, text: string) => {
    setOptions(prev => prev.map(opt => opt.id === id ? { ...opt, text } : opt));
  };
  
  const addOption = () => {
    if(options.length < 10) {
        setOptions(prev => [...prev, {id: `opt-${Date.now()}-${options.length+1}`, text: ''}])
    }
  };
  
  const removeOption = (id: string) => {
    if(options.length > 2) {
        setOptions(prev => prev.filter(opt => opt.id !== id));
    }
  };

  const handleSubmit = () => {
    const validOptions = options.filter(opt => opt.text.trim() !== '');
    if (question.trim() && validOptions.length >= 2) {
      onCreatePoll({
        question: question.trim(),
        options: validOptions.map(opt => ({...opt, votes: []}))
      });
      // Reset state for next time
      setQuestion('');
      setOptions([{ id: `opt-${Date.now()}-1`, text: '' }, { id: `opt-${Date.now()}-2`, text: '' }]);
      onClose();
    } else {
        alert("Please provide a question and at least two options.")
    }
  };

  const footer = (
    <>
      <Button variant="secondary" onClick={onClose}>Cancel</Button>
      <Button onClick={handleSubmit}>Create Poll</Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a Poll" footer={footer}>
      <div className="space-y-4">
        <Input
          label="Poll Question"
          id="poll-question"
          placeholder="What do you want to ask?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        <div>
          <h4 className="font-semibold mb-2 text-slate-700 dark:text-slate-300">Options</h4>
          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={option.id} className="flex items-center gap-2">
                <Input
                  id={option.id}
                  placeholder={`Option ${index + 1}`}
                  value={option.text}
                  onChange={(e) => handleOptionChange(option.id, e.target.value)}
                  className="w-full"
                />
                {options.length > 2 && (
                    <button onClick={() => removeOption(option.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full">&times;</button>
                )}
              </div>
            ))}
             {options.length < 10 && (
                <Button onClick={addOption} variant="ghost" className="w-full mt-2">
                    <PlusIcon className="w-4 h-4 mr-2" /> Add Option
                </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreatePollModal;
