export function SolidOverviewEs() {
  return (
    <>
      <p>
        Esta guía desglosa los principios SOLID uno por uno para que cada
        concepto deje de sentirse como una abstracción y se convierta en una
        técnica concreta que puedes aplicar hoy. Verás modelos mentales,
        anti-patrones y una historia que comienza con una sola responsabilidad y
        termina con un grafo de dependencias que prefiere interfaces sobre
        implementaciones.
      </p>
      <p>
        SOLID es un acrónimo acuñado por Robert C. Martin (Uncle Bob) que
        captura cinco principios de diseño para escribir código mantenible,
        escalable y testeable. Ya sea que estés construyendo un backend en C# o
        un frontend en TypeScript, estas ideas se traducen en las mismas
        verdades fundamentales: mantén los módulos pequeños, respeta los
        contratos y depende de abstracciones, no de detalles concretos.
      </p>

      {/* Principio de Responsabilidad Única */}
      <div className="rounded-lg border-l-4 border-l-blue-500 border border-border bg-blue-50/30 p-5 dark:bg-blue-950/20">
        <h3 className="font-semibold text-lg text-foreground">
          1. Principio de Responsabilidad Única (SRP)
        </h3>
        <p className="mt-2 text-sm">
          <span className="font-medium">Idea Central:</span> Una clase o módulo
          debe tener una y solo una razón para cambiar. Si te encuentras
          enumerando más de una responsabilidad, ya la has violado.
        </p>
        <p className="mt-2 text-sm">
          <span className="font-medium">Por qué Importa:</span> Cuando una clase
          maneja múltiples preocupaciones, digamos, parsear la entrada del
          usuario y enviar correos, un cambio en la lógica del correo te obliga
          a re-testear el parseo. Quedas atrapado en una red de efectos
          secundarios. Separar responsabilidades aísla el riesgo y simplifica
          las pruebas.
        </p>
        <p className="mt-2 text-sm">
          <span className="font-medium">En la Práctica:</span> En lugar de un
          UserService que haga todo, crea un UserValidator, un UserRepository y
          un EmailNotifier. Cada clase tiene una sola razón para cambiar.
        </p>
        <p className="mt-2 text-sm">
          <span className="font-medium">Señales de Alerta:</span> Nombres de
          clase como &ldquo;Manager&rdquo;, &ldquo;Service&rdquo; o
          &ldquo;Handler&rdquo; que sugieren múltiples trabajos; archivos de
          test que cubren comportamientos muy diferentes en un solo setup.
        </p>
      </div>

      {/* Principio Abierto/Cerrado */}
      <div className="rounded-lg border-l-4 border-l-emerald-500 border border-border bg-emerald-50/30 p-5 dark:bg-emerald-950/20">
        <h3 className="font-semibold text-lg text-foreground">
          2. Principio Abierto/Cerrado (OCP)
        </h3>
        <p className="mt-2 text-sm">
          <span className="font-medium">Idea Central:</span> Una clase debe
          estar abierta a la extensión pero cerrada a la modificación. El nuevo
          comportamiento debe llegar a través de herencia, composición o
          interfaces, no reescribiendo código existente.
        </p>
        <p className="mt-2 text-sm">
          <span className="font-medium">Por qué Importa:</span> Cada vez que
          abres una clase funcional para agregar una característica, arriesgas
          introducir bugs e invalidar tests. Al diseñar para extensión, las
          nuevas funcionalidades llegan en código nuevo, dejando la lógica
          probada intacta.
        </p>
        <p className="mt-2 text-sm">
          <span className="font-medium">En la Práctica:</span> En lugar de
          modificar una clase Logger para soportar múltiples formatos de salida,
          crea una clase base abstracta y deriva FileLogger, ConsoleLogger y
          CloudLogger. En TypeScript, usa interfaces y patrones strategy.
        </p>
        <p className="mt-2 text-sm">
          <span className="font-medium">Señales de Alerta:</span> Cadenas largas
          de if-else que verifican tipos o enums de string; comentarios diciendo
          &ldquo;TODO: refactorizar para la próxima feature&rdquo;;
          modificaciones al código viejo cada sprint.
        </p>
      </div>

      {/* Principio de Sustitución de Liskov */}
      <div className="rounded-lg border-l-4 border-l-amber-500 border border-border bg-amber-50/30 p-5 dark:bg-amber-950/20">
        <h3 className="font-semibold text-lg text-foreground">
          3. Principio de Sustitución de Liskov (LSP)
        </h3>
        <p className="mt-2 text-sm">
          <span className="font-medium">Idea Central:</span> Los objetos de una
          clase derivada deben poder reemplazar objetos de la clase base sin
          romper la aplicación.
        </p>
        <p className="mt-2 text-sm">
          <span className="font-medium">Por qué Importa:</span> Liskov asegura
          que las jerarquías de herencia permanezcan predecibles y seguras. Si
          tu código trata objetos como instancias de su tipo base, sustituir un
          tipo derivado nunca debería causar sorpresas.
        </p>
        <p className="mt-2 text-sm">
          <span className="font-medium">En la Práctica:</span> Una clase
          Rectangle tiene métodos SetWidth y SetHeight. Un Square podría
          intentar mantener sus lados iguales, violando el contrato. Liskov
          dice: si Square hereda de Rectangle, debe cumplir todas las promesas
          de Rectangle sin comportamiento sorpresivo.
        </p>
        <p className="mt-2 text-sm">
          <span className="font-medium">Señales de Alerta:</span> Clases
          derivadas que lanzan &ldquo;NotImplementedException&rdquo;; subclases
          que ignoran silenciosamente llamadas a métodos; verificaciones
          condicionales como <code>if (obj instanceof SpecificType)</code>{" "}
          dispersas en tu lógica.
        </p>
      </div>

      {/* Principio de Segregación de Interfaces */}
      <div className="rounded-lg border-l-4 border-l-rose-500 border border-border bg-rose-50/30 p-5 dark:bg-rose-950/20">
        <h3 className="font-semibold text-lg text-foreground">
          4. Principio de Segregación de Interfaces (ISP)
        </h3>
        <p className="mt-2 text-sm">
          <span className="font-medium">Idea Central:</span> Los clientes nunca
          deberían ser forzados a depender de interfaces que no usan.
        </p>
        <p className="mt-2 text-sm">
          <span className="font-medium">Por qué Importa:</span> Las interfaces
          gordas crean acoplamiento. Si una clase pequeña depende de una
          interfaz enorme, queda acoplada a cosas que no le importan. Segregar
          interfaces reduce la superficie de contacto.
        </p>
        <p className="mt-2 text-sm">
          <span className="font-medium">En la Práctica:</span> En lugar de una
          interfaz IDataProvider masiva, divídela en IReader, IWriter e ICache.
          Las clases que solo leen datos dependen solo de IReader.
        </p>
        <p className="mt-2 text-sm">
          <span className="font-medium">Señales de Alerta:</span> Interfaces con
          docenas de métodos; clases implementando interfaces dejando la mayoría
          de métodos vacíos; tests que mockean objetos enormes solo para probar
          una pequeña funcionalidad.
        </p>
      </div>

      {/* Principio de Inversión de Dependencias */}
      <div className="rounded-lg border-l-4 border-l-purple-500 border border-border bg-purple-50/30 p-5 dark:bg-purple-950/20">
        <h3 className="font-semibold text-lg text-foreground">
          5. Principio de Inversión de Dependencias (DIP)
        </h3>
        <p className="mt-2 text-sm">
          <span className="font-medium">Idea Central:</span> Los módulos de alto
          nivel no deben depender de módulos de bajo nivel. Ambos deben depender
          de abstracciones.
        </p>
        <p className="mt-2 text-sm">
          <span className="font-medium">Por qué Importa:</span> Si tu lógica de
          negocio crea o llama directamente implementaciones de bajo nivel,
          encadenas tu lógica core a esas implementaciones. Invertir la
          dependencia te permite cambiar implementaciones sin tocar el código
          central.
        </p>
        <p className="mt-2 text-sm">
          <span className="font-medium">En la Práctica:</span> En lugar de un
          UserService que instancie directamente un SqlUserRepository, inyecta
          una interfaz IUserRepository. En tiempo de ejecución, pasas la
          implementación concreta. Esta es la base de la inyección de
          dependencias.
        </p>
        <p className="mt-2 text-sm">
          <span className="font-medium">Señales de Alerta:</span> Uso de{" "}
          <code>new</code> disperso en tu lógica de negocio; tests que requieren
          una base de datos real o una API para ejecutarse; código de alto nivel
          importando archivos de implementación de bajo nivel.
        </p>
      </div>

      {/* Cómo Trabajan Juntos */}
      <div className="rounded-lg border border-border bg-muted p-5">
        <h3 className="font-semibold text-lg text-foreground">
          Cómo Trabajan Juntos
        </h3>
        <p className="mt-3 text-sm">
          Los cinco principios no son reglas aisladas; se refuerzan mutuamente.
          SRP mantiene las clases enfocadas. OCP asegura que agregar
          comportamiento no requiera modificar clases existentes. LSP garantiza
          que los tipos derivados sean seguros. ISP evita forzar a una clase a
          implementar más de lo que debería. Y DIP ata todo asegurando que las
          políticas de alto nivel dependan solo de abstracciones.
        </p>
        <p className="mt-3 text-sm">
          Cuando aplicas los cinco, terminas con un código más fácil de testear,
          menos frágil ante cambios de requerimientos, y mucho más agradable de
          mantener.
        </p>
      </div>

      {/* Lo que Sigue */}
      <div className="rounded-lg border border-border bg-muted p-5">
        <h3 className="font-semibold text-lg text-foreground">Lo que Sigue</h3>
        <p className="mt-3 text-sm">
          Cada artículo de esta serie toma un principio y lo recorre en
          profundidad. Verás errores comunes, anti-patrones y ejemplos concretos
          de refactorización en C# y TypeScript. El objetivo no es memorizar
          reglas sino desarrollar una intuición para cuando tu código empieza a
          doler, y cómo arreglarlo antes de que el dolor se vuelva severo.
        </p>
      </div>
    </>
  );
}
