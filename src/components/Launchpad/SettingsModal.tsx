import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppSettings, ThemeMode } from '../../types/bookmarks';
import { WALLPAPER_OPTIONS } from '../../data/presetApps';
import { exportExtensionZip } from '../../utils/exportExtension';
import { X, Moon, Sun, Monitor, Download, RefreshCw, HelpCircle, Check, Palette, Sliders, Shield, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  settings: AppSettings;
  isEditMode: boolean;
  onClose: () => void;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onToggleEditMode: () => void;
  onOpenGuide: () => void;
  onResetData: () => void;
}

type TabType = 'appearance' | 'navigation' | 'extension';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  isEditMode,
  onClose,
  onUpdateSettings,
  onToggleEditMode,
  onOpenGuide,
  onResetData
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('appearance');

  if (!isOpen) return null;

  const handleExport = async () => {
    try {
      await exportExtensionZip();
    } catch (err) {
      console.error('Erro ao exportar ZIP da extensão:', err);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-[#1e1f20] border border-[#3c4043] rounded-3xl p-6 shadow-2xl text-[#e3e3e3] overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#3c4043]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#28292a] border border-[#3c4043] flex items-center justify-center text-[#a8c7fa]">
                <Palette size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight text-[#e3e3e3]">
                  Configurações
                </h3>
                <p className="text-xs text-[#8e918f]">Personalize a sua nova guia e preferências</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#28292a] text-[#8e918f] hover:text-[#e3e3e3] transition-colors"
              title="Fechar"
            >
              <X size={18} />
            </button>
          </div>

          {/* Material Category Navigation Tabs */}
          <div className="flex items-center gap-1.5 mt-4 p-1 bg-[#28292a] border border-[#3c4043] rounded-2xl">
            {[
              { id: 'appearance', label: 'Personalização', icon: Palette },
              { id: 'navigation', label: 'Navegação', icon: Sliders },
              { id: 'extension', label: 'Extensão & Backup', icon: Shield }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#a8c7fa] text-[#040e29] shadow-sm'
                      : 'text-[#8e918f] hover:text-[#e3e3e3] hover:bg-[#333537]'
                  }`}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="mt-5 overflow-y-auto custom-scrollbar pr-1 flex-1">
            {/* TAB 1: PERSONALIZAÇÃO */}
            {activeTab === 'appearance' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Theme Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8e918f] mb-2.5">
                    Tema do Launchpad
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'dark', label: 'Escuro (Gemini)', icon: Moon },
                      { id: 'light', label: 'Claro (Gemini)', icon: Sun },
                      { id: 'system', label: 'Sistema', icon: Monitor }
                    ].map((mode) => {
                      const Icon = mode.icon;
                      const isSelected = settings.theme === mode.id;
                      return (
                        <button
                          key={mode.id}
                          onClick={() => onUpdateSettings({ theme: mode.id as ThemeMode })}
                          className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all ${
                            isSelected
                              ? 'bg-[#a8c7fa]/15 border-[#a8c7fa] text-[#a8c7fa] shadow-sm font-semibold'
                              : 'bg-[#28292a] border-[#3c4043] text-[#8e918f] hover:bg-[#333537] hover:text-[#e3e3e3]'
                          }`}
                        >
                          <Icon size={20} className={isSelected ? 'text-[#a8c7fa]' : ''} />
                          <span className="text-xs font-medium mt-2">{mode.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Wallpaper Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8e918f] mb-2.5">
                    Plano de Fundo
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {WALLPAPER_OPTIONS.map((wp) => {
                      const isSelected = settings.wallpaper === wp.id;
                      return (
                        <button
                          key={wp.id}
                          onClick={() => onUpdateSettings({ wallpaper: wp.id })}
                          className={`relative h-22 rounded-2xl overflow-hidden border transition-all p-3 flex flex-col justify-between text-left ${wp.preview} ${
                            isSelected
                              ? 'border-[#a8c7fa] ring-2 ring-[#a8c7fa]/50 scale-[1.02] shadow-lg'
                              : 'border-[#3c4043] hover:border-[#8e918f] hover:scale-[1.01]'
                          }`}
                        >
                          <span className="text-xs font-bold text-white drop-shadow-md">{wp.name}</span>
                          {isSelected && (
                            <span className="self-end p-1 rounded-full bg-[#a8c7fa] text-[#040e29] shadow-md">
                              <Check size={13} strokeWidth={3} />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Grid Columns Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#8e918f] mb-2.5">
                    Colunas de Aplicativos na Tela
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 7, label: '7 Colunas', desc: '21 aplicativos por página' },
                      { value: 8, label: '8 Colunas', desc: '24 aplicativos por página' }
                    ].map((option) => {
                      const isSelected = (settings.gridColumns || 7) === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => onUpdateSettings({ gridColumns: option.value })}
                          className={`flex flex-col items-start p-3.5 rounded-2xl border transition-all text-left ${
                            isSelected
                              ? 'bg-[#a8c7fa]/15 border-[#a8c7fa] text-[#a8c7fa] shadow-sm font-semibold'
                              : 'bg-[#28292a] border-[#3c4043] text-[#8e918f] hover:bg-[#333537] hover:text-[#e3e3e3]'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-sm font-bold text-[#e3e3e3]">{option.label}</span>
                            {isSelected && (
                              <span className="p-0.5 rounded-full bg-[#a8c7fa] text-[#040e29]">
                                <Check size={12} strokeWidth={3} />
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-[#8e918f] mt-1">{option.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: NAVEGAÇÃO & ORGANIZAÇÃO */}
            {activeTab === 'navigation' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="p-4 rounded-2xl bg-[#28292a] border border-[#3c4043] flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-[#e3e3e3]">Modo de Organização</h4>
                    <p className="text-xs text-[#8e918f] mt-0.5">
                      Habilite para gerenciar, renomear e excluir ícones diretamente na grade.
                    </p>
                  </div>
                  <button
                    onClick={onToggleEditMode}
                    className={`relative w-12 h-6 rounded-full transition-colors flex items-center p-1 ${
                      isEditMode ? 'bg-[#a8c7fa]' : 'bg-[#3c4043]'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-[#040e29] transition-transform ${
                        isEditMode ? 'translate-x-6 bg-[#040e29]' : 'translate-x-0 bg-[#8e918f]'
                      }`}
                    />
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-[#28292a] border border-[#3c4043] flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-[#e3e3e3]">Abrir Links em Nova Guia</h4>
                    <p className="text-xs text-[#8e918f] mt-0.5">
                      Abre seus favoritos em uma nova aba mantendo o Launchpad aberto.
                    </p>
                  </div>
                  <button
                    onClick={() => onUpdateSettings({ openInNewTab: !settings.openInNewTab })}
                    className={`relative w-12 h-6 rounded-full transition-colors flex items-center p-1 ${
                      settings.openInNewTab ? 'bg-[#a8c7fa]' : 'bg-[#3c4043]'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full transition-transform ${
                        settings.openInNewTab ? 'translate-x-6 bg-[#040e29]' : 'translate-x-0 bg-[#8e918f]'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: EXTENSÃO & BACKUP */}
            {activeTab === 'extension' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Download Extension */}
                <div className="p-4 rounded-2xl bg-[#28292a] border border-[#3c4043] space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-[#1e1f20] border border-[#3c4043] text-[#a8c7fa]">
                      <Download size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#e3e3e3]">Extensão do Navegador (Manifest V3)</h4>
                      <p className="text-xs text-[#8e918f] mt-0.5">
                        Instale o Atlas Box no Chrome ou Edge para substituir a tela padrão de Nova Guia.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                    <button
                      onClick={handleExport}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-[#a8c7fa] hover:bg-[#8ab4f8] text-[#040e29] text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      <Download size={15} />
                      Baixar Pacote ZIP
                    </button>
                    <button
                      onClick={onOpenGuide}
                      className="py-2.5 px-4 rounded-xl bg-[#1e1f20] hover:bg-[#333537] text-[#e3e3e3] border border-[#3c4043] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <HelpCircle size={15} />
                      Passo a Passo
                    </button>
                  </div>
                </div>

                {/* Reset Data */}
                <div className="p-4 rounded-2xl bg-[#28292a] border border-[#ea4335]/30 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-[#f28b82]">Restaurar Configurações e Dados</h4>
                    <p className="text-xs text-[#8e918f] mt-0.5">
                      Restaura todos os favoritos e preferências padrão de demonstração.
                    </p>
                  </div>
                  <button
                    onClick={onResetData}
                    className="px-3.5 py-2 rounded-xl bg-[#ea4335]/20 hover:bg-[#ea4335]/30 text-[#f28b82] text-xs font-medium flex items-center gap-1.5 transition-colors border border-[#ea4335]/40 flex-shrink-0"
                  >
                    <RefreshCw size={14} />
                    Restaurar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-5 pt-3 border-t border-[#3c4043] flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#a8c7fa] hover:bg-[#8ab4f8] text-[#040e29] font-semibold text-xs transition-colors shadow-md"
            >
              Concluído
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

