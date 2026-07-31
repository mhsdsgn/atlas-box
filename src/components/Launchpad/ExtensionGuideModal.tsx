import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Chrome, FolderCheck, Download, Zap } from 'lucide-react';
import { exportExtensionZip } from '../../utils/exportExtension';

interface ExtensionGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExtensionGuideModal: React.FC<ExtensionGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-2xl bg-[#1e1f20] border border-[#3c4043] rounded-3xl p-6 sm:p-8 shadow-2xl text-[#e3e3e3] overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#3c4043]">
            <h3 className="text-xl font-bold tracking-tight text-[#e3e3e3] flex items-center gap-2">
              <Chrome className="text-[#a8c7fa]" size={24} />
              Como instalar no Chrome ou Edge
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#28292a] text-[#8e918f] hover:text-[#e3e3e3] transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Step-by-Step List */}
          <div className="mt-4 space-y-4 overflow-y-auto custom-scrollbar pr-1 text-sm text-[#e3e3e3]">
            <p className="text-[#8e918f] text-xs">
              Siga estes 4 passos simples para usar o Atlas Box como extensão oficial na sua Nova Guia:
            </p>

            <div className="space-y-3">
              {/* Step 1 */}
              <div className="flex gap-3.5 p-3.5 rounded-2xl bg-[#28292a] border border-[#3c4043]">
                <div className="w-8 h-8 rounded-xl bg-[#a8c7fa] text-[#040e29] font-bold flex items-center justify-center flex-shrink-0 text-sm">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-[#e3e3e3]">Baixar a Extensão</h4>
                  <p className="text-xs text-[#8e918f] mt-0.5">
                    Clique no botão abaixo para baixar o arquivo <code className="bg-[#1e1f20] px-1.5 py-0.5 rounded text-[#a8c7fa]">atlas-box-extension.zip</code> e extraia a pasta no seu computador.
                  </p>
                  <button
                    onClick={exportExtensionZip}
                    className="mt-2.5 px-3.5 py-1.5 rounded-xl bg-[#a8c7fa] hover:bg-[#8ab4f8] text-[#040e29] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <Download size={14} />
                    Baixar ZIP da Extensão
                  </button>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-3.5 p-3.5 rounded-2xl bg-[#28292a] border border-[#3c4043]">
                <div className="w-8 h-8 rounded-xl bg-[#a8c7fa] text-[#040e29] font-bold flex items-center justify-center flex-shrink-0 text-sm">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-[#e3e3e3]">Abrir a página de extensões</h4>
                  <p className="text-xs text-[#8e918f] mt-0.5">
                    No seu navegador, abra a barra de endereço e acesse:
                  </p>
                  <div className="mt-1.5 flex gap-2">
                    <span className="px-2.5 py-1 bg-[#1e1f20] border border-[#3c4043] rounded-lg text-xs font-mono text-[#a8c7fa]">
                      chrome://extensions
                    </span>
                    <span className="px-2.5 py-1 bg-[#1e1f20] border border-[#3c4043] rounded-lg text-xs font-mono text-[#a8c7fa]">
                      edge://extensions
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-3.5 p-3.5 rounded-2xl bg-[#28292a] border border-[#3c4043]">
                <div className="w-8 h-8 rounded-xl bg-[#a8c7fa] text-[#040e29] font-bold flex items-center justify-center flex-shrink-0 text-sm">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-[#e3e3e3]">Ativar "Modo do Desenvolvedor"</h4>
                  <p className="text-xs text-[#8e918f] mt-0.5">
                    No canto superior direito da página de extensões, ative a chave <strong>Modo do desenvolvedor</strong>.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-3.5 p-3.5 rounded-2xl bg-[#28292a] border border-[#3c4043]">
                <div className="w-8 h-8 rounded-xl bg-[#a8c7fa] text-[#040e29] font-bold flex items-center justify-center flex-shrink-0 text-sm">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-[#e3e3e3]">Carregar Sem Compactação</h4>
                  <p className="text-xs text-[#8e918f] mt-0.5">
                    Clique no botão <strong>Carregar sem compactação</strong> (Load unpacked) e selecione a pasta extraída.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#a8c7fa]/10 border border-[#a8c7fa]/20 text-[#a8c7fa] text-xs flex items-center gap-2">
              <Zap size={18} className="text-[#a8c7fa] flex-shrink-0" />
              <span>
                Pronto! Abra uma Nova Guia (Ctrl+T) e você verá o seu Launchpad sincronizado com seus Favoritos.
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#3c4043] flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#28292a] hover:bg-[#333537] border border-[#3c4043] text-[#e3e3e3] font-medium text-xs transition-colors"
            >
              Entendi
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
