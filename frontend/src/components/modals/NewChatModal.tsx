import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { useChatContext } from '@/contexts/ChatContext';
import type { User } from '@/types';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewChatModal({ isOpen, onClose }: NewChatModalProps) {
  const [search, setSearch] = useState('');
  const { conversations, selectConversation, currentUser } = useChatContext();

  // Get unique contacts from conversations
  const contacts = useMemo(() => {
    const contactMap = new Map<string, User>();
    conversations.forEach((conv) => {
      if (conv.type === 'direct' && conv.memberDetails) {
        conv.memberDetails.forEach((member) => {
          if (member.id !== currentUser.id) {
            contactMap.set(member.id, member);
          }
        });
      }
    });
    return Array.from(contactMap.values());
  }, [conversations, currentUser.id]);

  const filteredContacts = useMemo(() => {
    if (!search.trim()) return contacts;
    const query = search.toLowerCase();
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query)
    );
  }, [contacts, search]);

  const handleSelectContact = (contact: User) => {
    // Find the conversation with this contact
    const conv = conversations.find(
      (c) =>
        c.type === 'direct' &&
        c.members.includes(contact.id)
    );
    if (conv) {
      selectConversation(conv.id);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Chat">
      {/* Search */}
      <div className="px-4 pb-3">
        <div className="relative flex items-center">
          <Search
            size={15}
            className="absolute left-3 text-[var(--text-secondary)] pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts"
            className="w-full h-[36px] pl-9 pr-3 rounded-lg bg-[var(--bg-input)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-placeholder)] border-none outline-none focus:ring-1 focus:ring-[var(--accent)]"
            autoFocus
          />
        </div>
      </div>

      {/* Contact List */}
      <div className="max-h-[360px] overflow-y-auto">
        {filteredContacts.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-[var(--text-secondary)]">No contacts found</p>
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => handleSelectContact(contact)}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
            >
              <Avatar
                src={contact.avatar}
                name={contact.name}
                size="md"
                isOnline={contact.isOnline}
                showOnlineIndicator
              />
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                  {contact.name}
                </p>
                <p className="text-xs text-[var(--text-secondary)] truncate">
                  {contact.about || 'Hey there! I am using Connect'}
                </p>
              </div>
              {contact.isOnline && (
                <span className="text-[11px] text-[var(--accent)]">online</span>
              )}
            </button>
          ))
        )}
      </div>
    </Modal>
  );
}

