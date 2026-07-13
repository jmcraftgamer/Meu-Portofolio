import { Zap, Mail, Phone, MapPin, Github, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-gold rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold">
                <span className="text-gradient">Dev</span>
                <span className="text-white">Pro</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-md">
              Transformamos ideias em soluções digitais poderosas. Sites, aplicativos mobile e sistemas desktop 
              que impulsionam o seu negócio para o próximo nível.
            </p>
          </div>

          <div>
            <h4 className="text-gold font-semibold mb-3 text-sm uppercase tracking-wider">Links</h4>
            <div className="space-y-2 text-sm">
              <a href="/" className="block text-gray-500 hover:text-gold transition-colors">Início</a>
              <a href="/testar" className="block text-gray-500 hover:text-gold transition-colors">Testar Apps</a>
              <a href="/order" className="block text-gray-500 hover:text-gold transition-colors">Fazer Pedido</a>
            </div>
          </div>

          <div>
            <h4 className="text-gold font-semibold mb-3 text-sm uppercase tracking-wider">Contato</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <Mail className="w-3.5 h-3.5 text-gold" />
                <span>contato@devpro.com</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Phone className="w-3.5 h-3.5 text-gold" />
                <span>(32) 99934-4496</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin className="w-3.5 h-3.5 text-gold" />
                <span>Minas Gerais</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gold/10 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs">
            © 2024 DevPro. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Github className="w-4 h-4 text-gray-600 hover:text-gold cursor-pointer transition-colors" />
            <Instagram className="w-4 h-4 text-gray-600 hover:text-gold cursor-pointer transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  );
}
