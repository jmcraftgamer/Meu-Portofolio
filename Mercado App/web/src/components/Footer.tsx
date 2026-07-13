export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="bg-white text-primary-600 font-bold text-xl px-3 py-1 rounded inline-block mb-3">
              Central
            </div>
            <p className="text-sm text-gray-400">Seu mercado de confianca com os melhores precos e qualidade.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Links Uteis</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-white transition-colors">Inicio</a></li>
              <li><a href="/promocoes" className="hover:text-white transition-colors">Promocoes</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">Contato</h4>
            <ul className="space-y-2 text-sm">
              <li>(xx) xxxx-xxxx</li>
              <li>contato@central.com.br</li>
              <li>Seg a Sab - 07h as 20h</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-6 pt-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Central. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
