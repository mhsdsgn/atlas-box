import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookmarkItem } from '../../types/bookmarks';
import { POPULAR_PRESET_APPS } from '../../data/presetApps';
import { getFaviconUrl, ensureHttpUrl } from '../../utils/favicon';
import { X, Globe, Sparkles, Image, Check, Link, Type, Upload, Trash2, Folder } from 'lucide-react';

interface EditAppModalProps {
  item: BookmarkItem | null;
  isOpen: boolean;
  parentFolderId?: string;
  folders: BookmarkItem[];
  onClose: () => void;
  onSave: (
    id: string | null,
    data: {
      title: string;
      url?: string;
      customIcon?: string;
      customTitle?: string;
      parentId?: string;
      isFolder?: boolean;
      folderType?: 'normal' | 'super';
      folderColor?: string;
    }
  ) => void;
}

const FOLDER_EMOJIS = ['📁', '⚡', '🚀', '💻', '🎨', '🎮', '📚', '🛍️', '💼', '🎵', '⭐️', '🔥', '💡', '🌐', '🍔', '🎬', '📌', '🛠️'];

const FOLDER_COLORS = [
  { name: 'Azul', value: '#a8c7fa', bg: 'bg-[#a8c7fa]' },
  { name: 'Roxo', value: '#c5b4e3', bg: 'bg-[#c5b4e3]' },
  { name: 'Esmeralda', value: '#6dd58c', bg: 'bg-[#6dd58c]' },
  { name: 'Âmbar', value: '#f6ad55', bg: 'bg-[#f6ad55]' },
  { name: 'Rosa', value: '#f687b3', bg: 'bg-[#f687b3]' },
  { name: 'Ciano', value: '#76e4f7', bg: 'bg-[#76e4f7]' },
  { name: 'Grafite', value: '#9aa0a6', bg: 'bg-[#9aa0a6]' }
];

export const EditAppModal: React.FC<EditAppModalProps> = ({
  item,
  isOpen,
  parentFolderId = '1',
  folders,
  onClose,
  onSave
}) => {
  const [isFolder, setIsFolder] = useState(false);
  const [folderType, setFolderType] = useState<'normal' | 'super'>('normal');
  const [folderColor, setFolderColor] = useState('#a8c7fa');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [customIconUrl, setCustomIconUrl] = useState('');
  const [selectedParentId, setSelectedParentId] = useState(parentFolderId);
  const [activeTab, setActiveTab] = useState<'presets' | 'url' | 'upload'>('presets');
  const [folderIconMode, setFolderIconMode] = useState<'emoji' | 'url' | 'upload'>('emoji');
  const [imgPreviewError, setImgPreviewError] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (item) {
      const isItemFolder = !!item.children;
      setIsFolder(isItemFolder);
      setFolderType(item.folderType || 'normal');
      setFolderColor(item.folderColor || '#a8c7fa');
      setTitle(item.customTitle || item.title || '');
      setUrl(item.url || '');
      setCustomIconUrl(item.customIcon || '');
      setSelectedParentId(item.parentId || '1');
    } else {
      setIsFolder(false);
      setFolderType('normal');
      setFolderColor('#a8c7fa');
      setTitle('');
      setUrl('');
      setCustomIconUrl('');
      setSelectedParentId(parentFolderId);
    }
    setImgPreviewError(false);
  }, [item, isOpen, parentFolderId]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 3MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setCustomIconUrl(ev.target.result as string);
          setImgPreviewError(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const currentPreviewIcon = customIconUrl.trim()
    ? customIconUrl.trim()
    : getFaviconUrl(url ? ensureHttpUrl(url) : '');

  const handleApplyPreset = (preset: typeof POPULAR_PRESET_APPS[0]) => {
    if (!title) setTitle(preset.name);
    if (!url) setUrl(preset.url);
    setCustomIconUrl(preset.icon);
    setImgPreviewError(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave(item ? item.id : null, {
      title: title.trim(),
      url: !isFolder && url ? ensureHttpUrl(url) : undefined,
      customIcon: customIconUrl.trim() || undefined,
      customTitle: title.trim(),
      parentId: selectedParentId,
      isFolder,
      folderType: isFolder ? folderType : undefined,
      folderColor: isFolder ? folderColor : undefined
    });

    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-lg bg-[#1e1f20] border border-[#3c4043] rounded-3xl p-6 shadow-2xl text-[#e3e3e3] overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#3c4043]">
            <h3 className="text-xl font-bold tracking-tight text-[#e3e3e3] flex items-center gap-2">
              <Sparkles className="text-[#a8c7fa]" size={20} />
              {item ? (isFolder ? 'Editar Pasta' : 'Personalizar Aplicativo') : 'Novo Aplicativo / Favorito'}
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#28292a] text-[#8e918f] hover:text-[#e3e3e3] transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4 overflow-y-auto custom-scrollbar pr-1">
            {/* Live Icon Preview Banner */}
            {!isFolder && (
              <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-[#28292a] border border-[#3c4043]">
                <div className="relative w-16 h-16 rounded-[22%] bg-[#1e1f20] border border-[#3c4043] flex items-center justify-center overflow-hidden p-2 flex-shrink-0 shadow-md">
                  {currentPreviewIcon && !imgPreviewError ? (
                    <img
                      src={currentPreviewIcon}
                      alt="Prévia"
                      referrerPolicy="no-referrer"
                      onError={() => setImgPreviewError(true)}
                      className="w-full h-full object-contain rounded-[16%]"
                    />
                  ) : (
                    <Globe size={28} className="text-[#a8c7fa]" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-[#a8c7fa] uppercase tracking-wider block">
                    Prévia do Ícone
                  </span>
                  <p className="text-sm font-medium text-[#e3e3e3] truncate">{title || 'Nome do aplicativo'}</p>
                  <p className="text-xs text-[#8e918f] truncate">{url || 'https://exemplo.com'}</p>
                </div>
              </div>
            )}

            {/* Title Input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#8e918f] mb-1 flex items-center gap-1.5">
                <Type size={14} className="text-[#a8c7fa]" />
                {isFolder ? 'Nome da Pasta' : 'Nome do Aplicativo'}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: GitHub, Figma, Canaltech..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#28292a] border border-[#3c4043] text-[#e3e3e3] placeholder-[#8e918f] focus:outline-none focus:border-[#a8c7fa] text-sm"
              />
            </div>

            {/* URL Input (if not folder) */}
            {!isFolder && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#8e918f] mb-1 flex items-center gap-1.5">
                  <Link size={14} className="text-[#a8c7fa]" />
                  Endereço Web (URL)
                </label>
                <input
                  type="text"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://github.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#28292a] border border-[#3c4043] text-[#e3e3e3] placeholder-[#8e918f] focus:outline-none focus:border-[#a8c7fa] text-sm"
                />
              </div>
            )}

            {/* Folder Specific Settings (when isFolder is true) */}
            {isFolder && (
              <div className="space-y-4 pt-1">
                {/* Folder Type Selection */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#8e918f] mb-2">
                    Tipo de Pasta
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFolderType('normal')}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-1.5 ${
                        folderType === 'normal'
                          ? 'bg-[#28292a] border-[#a8c7fa] ring-1 ring-[#a8c7fa] text-white'
                          : 'bg-[#1e1f20] border-[#3c4043] text-[#8e918f] hover:border-[#8e918f]'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-sm text-[#e3e3e3]">
                        <span>📁</span>
                        <span>Pasta Normal</span>
                      </div>
                      <span className="text-[11px] text-[#8e918f] leading-tight">
                        Exibição em grade simples de ícones.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFolderType('super')}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-1.5 relative overflow-hidden ${
                        folderType === 'super'
                          ? 'bg-[#28292a] border-amber-400 ring-1 ring-amber-400 text-white shadow-lg'
                          : 'bg-[#1e1f20] border-[#3c4043] text-[#8e918f] hover:border-[#8e918f]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-sm text-amber-300">
                          <span>⚡</span>
                          <span>SUPER PASTA</span>
                        </div>
                        <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          PRO
                        </span>
                      </div>
                      <span className="text-[11px] text-[#8e918f] leading-tight">
                        Suporte a sub-páginas, abas e sub-grupos num card expandido!
                      </span>
                    </button>
                  </div>
                </div>

                {/* Custom Folder Icon / Emoji / Image / Upload Selector */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#8e918f] flex items-center gap-1.5">
                      <Sparkles size={14} className="text-[#a8c7fa]" />
                      Ícone da Pasta
                    </label>

                    {/* Mode selector tabs for Folder Icon */}
                    <div className="flex bg-[#28292a] rounded-lg p-0.5 text-[11px] border border-[#3c4043]">
                      <button
                        type="button"
                        onClick={() => setFolderIconMode('emoji')}
                        className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                          folderIconMode === 'emoji' ? 'bg-[#a8c7fa] text-[#040e29]' : 'text-[#8e918f] hover:text-[#e3e3e3]'
                        }`}
                      >
                        Emoji
                      </button>
                      <button
                        type="button"
                        onClick={() => setFolderIconMode('url')}
                        className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                          folderIconMode === 'url' ? 'bg-[#a8c7fa] text-[#040e29]' : 'text-[#8e918f] hover:text-[#e3e3e3]'
                        }`}
                      >
                        URL da Internet
                      </button>
                      <button
                        type="button"
                        onClick={() => setFolderIconMode('upload')}
                        className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                          folderIconMode === 'upload' ? 'bg-[#a8c7fa] text-[#040e29]' : 'text-[#8e918f] hover:text-[#e3e3e3]'
                        }`}
                      >
                        Upload de Arquivo
                      </button>
                    </div>
                  </div>

                  {/* Folder Icon Live Preview */}
                  <div className="flex items-center gap-3 p-3 bg-[#28292a] rounded-xl border border-[#3c4043] mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#1e1f20] border border-[#3c4043] flex items-center justify-center overflow-hidden flex-shrink-0 text-2xl shadow-inner">
                      {customIconUrl ? (
                        customIconUrl.length <= 4 && !customIconUrl.startsWith('http') && !customIconUrl.startsWith('data:') ? (
                          <span>{customIconUrl}</span>
                        ) : (
                          <img src={customIconUrl} alt="Ícone" className="w-full h-full object-contain p-1 rounded-lg" />
                        )
                      ) : (
                        <Folder className="text-[#a8c7fa]" size={24} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#e3e3e3]">Ícone Atual da Pasta</p>
                      <p className="text-[11px] text-[#8e918f] truncate">
                        {customIconUrl ? (customIconUrl.startsWith('data:') ? 'Imagem carregada do computador' : customIconUrl) : 'Padrão (grade de miniaturas)'}
                      </p>
                      {customIconUrl && (
                        <button
                          type="button"
                          onClick={() => setCustomIconUrl('')}
                          className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 mt-0.5 font-medium"
                        >
                          <Trash2 size={11} />
                          <span>Remover ícone personalizado</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {folderIconMode === 'emoji' && (
                    <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar p-2 bg-[#28292a] rounded-xl border border-[#3c4043]">
                      {FOLDER_EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setCustomIconUrl(emoji)}
                          className={`w-9 h-9 flex-shrink-0 rounded-lg text-lg flex items-center justify-center transition-all ${
                            customIconUrl === emoji
                              ? 'bg-[#a8c7fa] text-[#040e29] font-bold scale-110 shadow-md'
                              : 'hover:bg-[#333537] text-white'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}

                  {folderIconMode === 'url' && (
                    <div className="space-y-2">
                      <input
                        type="url"
                        value={customIconUrl.startsWith('data:') ? '' : customIconUrl}
                        onChange={(e) => setCustomIconUrl(e.target.value)}
                        placeholder="Cole a URL de qualquer imagem (https://exemplo.com/icone.png)"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#28292a] border border-[#3c4043] text-[#e3e3e3] placeholder-[#8e918f] focus:outline-none focus:border-[#a8c7fa] text-sm"
                      />
                      <p className="text-[11px] text-[#8e918f]">
                        Você pode colar um link de imagem do Google, Flaticon, Pinterest, Canva, App Store ou SVG.
                      </p>
                    </div>
                  )}

                  {folderIconMode === 'upload' && (
                    <div className="p-4 rounded-xl bg-[#28292a] border border-dashed border-[#444746] flex flex-col items-center justify-center gap-2 text-center">
                      <Upload className="text-[#a8c7fa]" size={24} />
                      <div className="text-xs text-[#e3e3e3]">
                        <p className="font-semibold">Escolha um arquivo do seu computador</p>
                        <p className="text-[11px] text-[#8e918f]">Suporta PNG, JPG, WEBP, SVG (máx. 3MB)</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl bg-[#a8c7fa] hover:bg-[#8ab4f8] text-[#040e29] text-xs font-semibold transition-all shadow"
                      >
                        Selecionar Imagem...
                      </button>
                    </div>
                  )}
                </div>

                {/* Folder Accent Color */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#8e918f] mb-2">
                    Cor de Destaque da Pasta
                  </label>
                  <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar p-2 bg-[#28292a] rounded-xl border border-[#3c4043]">
                    {FOLDER_COLORS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setFolderColor(c.value)}
                        className={`w-8 h-8 rounded-full ${c.bg} flex items-center justify-center transition-transform ${
                          folderColor === c.value ? 'scale-125 ring-2 ring-white shadow-lg' : 'opacity-80 hover:opacity-100 hover:scale-110'
                        }`}
                        title={c.name}
                      >
                        {folderColor === c.value && <Check size={14} className="text-black stroke-[3]" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Parent Folder Selection */}
            {folders.length > 0 && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#8e918f] mb-1">
                  Pasta Destino
                </label>
                <select
                  value={selectedParentId}
                  onChange={(e) => setSelectedParentId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#28292a] border border-[#3c4043] text-[#e3e3e3] focus:outline-none focus:border-[#a8c7fa] text-sm"
                >
                  <option value="1">Barra Principal (Início)</option>
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>
                      📁 {f.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Icon Customization Section */}
            {!isFolder && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#8e918f] flex items-center gap-1.5">
                    <Image size={14} className="text-[#a8c7fa]" />
                    Ícone do Aplicativo
                  </label>

                  <div className="flex bg-[#28292a] rounded-lg p-0.5 text-xs border border-[#3c4043]">
                    <button
                      type="button"
                      onClick={() => setActiveTab('presets')}
                      className={`px-3 py-1 rounded-md font-medium transition-colors ${
                        activeTab === 'presets' ? 'bg-[#a8c7fa] text-[#040e29]' : 'text-[#8e918f] hover:text-[#e3e3e3]'
                      }`}
                    >
                      Predefinições
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('url')}
                      className={`px-3 py-1 rounded-md font-medium transition-colors ${
                        activeTab === 'url' ? 'bg-[#a8c7fa] text-[#040e29]' : 'text-[#8e918f] hover:text-[#e3e3e3]'
                      }`}
                    >
                      URL da Imagem
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('upload')}
                      className={`px-3 py-1 rounded-md font-medium transition-colors ${
                        activeTab === 'upload' ? 'bg-[#a8c7fa] text-[#040e29]' : 'text-[#8e918f] hover:text-[#e3e3e3]'
                      }`}
                    >
                      Upload de Arquivo
                    </button>
                  </div>
                </div>

                {activeTab === 'url' && (
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={customIconUrl.startsWith('data:') ? '' : customIconUrl}
                      onChange={(e) => {
                        setCustomIconUrl(e.target.value);
                        setImgPreviewError(false);
                      }}
                      placeholder="Cole a URL de qualquer imagem da internet (App Store, CDN, SVG...)"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#28292a] border border-[#3c4043] text-[#e3e3e3] placeholder-[#8e918f] focus:outline-none focus:border-[#a8c7fa] text-sm"
                    />
                    <p className="text-[11px] text-[#8e918f]">
                      Cole o link direto de uma imagem ou de um aplicativo da App Store da Apple. Se deixado em branco, o favicon oficial do site é usado.
                    </p>
                  </div>
                )}

                {activeTab === 'upload' && (
                  <div className="p-4 rounded-xl bg-[#28292a] border border-dashed border-[#444746] flex flex-col items-center justify-center gap-2 text-center">
                    <Upload className="text-[#a8c7fa]" size={24} />
                    <div className="text-xs text-[#e3e3e3]">
                      <p className="font-semibold">Escolha um arquivo do seu computador</p>
                      <p className="text-[11px] text-[#8e918f]">Suporta PNG, JPG, WEBP, SVG (máx. 3MB)</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-[#a8c7fa] hover:bg-[#8ab4f8] text-[#040e29] text-xs font-semibold transition-all shadow"
                    >
                      Selecionar Imagem...
                    </button>
                  </div>
                )}

                {activeTab === 'presets' && (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-40 overflow-y-auto custom-scrollbar p-1.5 bg-[#28292a] rounded-2xl border border-[#3c4043]">
                    {POPULAR_PRESET_APPS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all hover:bg-[#333537] border ${
                          customIconUrl === preset.icon ? 'bg-[#a8c7fa]/20 border-[#a8c7fa]' : 'border-transparent'
                        }`}
                        title={preset.name}
                      >
                        <img
                          src={preset.icon}
                          alt={preset.name}
                          className="w-8 h-8 object-contain rounded-lg drop-shadow"
                        />
                        <span className="text-[10px] text-[#e3e3e3] truncate w-full text-center mt-1">
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {customIconUrl && (
                  <button
                    type="button"
                    onClick={() => setCustomIconUrl('')}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 mt-2 font-medium"
                  >
                    <Trash2 size={12} />
                    <span>Remover ícone personalizado (usar favicon padrão)</span>
                  </button>
                )}
              </div>
            )}

            {/* Submit buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#3c4043]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-[#28292a] hover:bg-[#333537] border border-[#3c4043] text-[#e3e3e3] text-sm font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#a8c7fa] hover:bg-[#8ab4f8] text-[#040e29] text-sm font-semibold transition-all shadow-md flex items-center gap-1.5"
              >
                <Check size={16} />
                Salvar
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
