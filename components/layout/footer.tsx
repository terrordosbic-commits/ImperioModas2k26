import Link from 'next/link'
import { Phone, MessageCircle, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-primary">IMPÉRIO MODAS</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Moda infantil com qualidade, estilo e preço justo. Entrega em Lages e região.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold">Contato</h4>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <a
                href="https://wa.me/554999882363"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-primary"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp: (49) 99988-2363
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Lages - SC
              </div>
            </div>
          </div>

          {/* Developer */}
          <div>
            <h4 className="font-semibold">Desenvolvedor</h4>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <p>Andrew Maia</p>
              <a
                href="https://wa.me/5549999726586"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-primary"
              >
                <Phone className="h-4 w-4" />
                Quer criar o seu site? Chame aqui
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-4 text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Império Modas. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
