import { CodeBlock } from "@/components/code-block";

export function IspContentEs() {
  return (
    <>
      {/* Introducción */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Introducción</h2>
        <p>
          El Principio de Segregación de Interfaces (ISP) establece:{" "}
          <span className="font-semibold">
            ningún cliente debería verse forzado a depender de métodos que no
            utiliza
          </span>
          . En términos prácticos, esto significa preferir varias interfaces
          pequeñas y enfocadas sobre una sola interfaz grande y de propósito
          general.
        </p>
        <p>
          Las violaciones de ISP son sutiles. Una interfaz &ldquo;gorda&rdquo;
          puede parecer conveniente: un solo contrato que cubre todo. Pero
          cuando una clase implementa esa interfaz y la mitad de los métodos
          lanzan <span className="font-mono">NotImplementedException</span> o
          retornan valores ficticios, algo está mal. La interfaz está forzando a
          los implementadores a prometer capacidades que no tienen.
        </p>
        <p>
          Este principio importa porque las interfaces gordas crean
          acoplamiento. Cuando dependes de una interfaz con 15 métodos pero solo
          usas 3, los cambios en los otros 12 métodos aún pueden forzarte a
          recompilar, re-probar y re-desplegar. Las interfaces enfocadas
          minimizan este acoplamiento.
        </p>
        <p>
          En este artículo, exploramos ISP a través de un escenario real:
          construir un sistema de gestión de Comunidad de Práctica. Verás cómo
          el diseño de repositorios de Gathering, sus abstracciones CQRS e
          interfaces de almacenamiento demuestran una adecuada segregación de
          interfaces, y qué sucede cuando la ignoras.
        </p>
      </div>

      {/* El Problema */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          El Problema: Interfaces Gordas
        </h2>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          Un Ejemplo Simple: Impresora Multifunción
        </h3>

        <p>
          Antes de sumergirnos en el código de Gathering, veamos la violación
          clásica de ISP: una interfaz de dispositivo multifunción. Esto ilustra
          el principio central sin necesitar contexto de aplicación.
        </p>

        <h4 className="text-base font-semibold text-foreground mt-4">
          Sin ISP: Una Interfaz para Gobernarlos a Todos
        </h4>

        <CodeBlock language="csharp">
          {
            'public interface IMultiFunctionDevice\n{\n    void Print(Document doc);\n    void Scan(Document doc);\n    void Fax(Document doc);\n    void Staple(Document doc);\n    void PhotoCopy(Document doc);\n}\n\n// Una impresora básica es forzada a implementar todo\npublic class BasicInkjetPrinter : IMultiFunctionDevice\n{\n    public void Print(Document doc)\n    {\n        // Esto funciona bien\n        Console.WriteLine("Imprimiendo: " + doc.Name);\n    }\n\n    public void Scan(Document doc)\n    {\n        throw new NotSupportedException("Esta impresora no puede escanear");\n    }\n\n    public void Fax(Document doc)\n    {\n        throw new NotSupportedException("Esta impresora no puede enviar fax");\n    }\n\n    public void Staple(Document doc)\n    {\n        throw new NotSupportedException("Esta impresora no puede engrapar");\n    }\n\n    public void PhotoCopy(Document doc)\n    {\n        throw new NotSupportedException("Esta impresora no puede fotocopiar");\n    }\n}'
          }
        </CodeBlock>

        <p className="mt-4">
          <span className="font-semibold">El problema:</span> BasicInkjetPrinter
          es forzada a implementar 5 métodos pero solo soporta 1. Los otros 4
          son trampas: compilan pero lanzan excepciones en tiempo de ejecución.
          Cualquier cliente que reciba un{" "}
          <span className="font-mono">IMultiFunctionDevice</span> no puede
          confiar en que todos los métodos funcionen.
        </p>

        <h4 className="text-base font-semibold text-foreground mt-4">
          Con ISP: Interfaces Enfocadas
        </h4>

        <CodeBlock language="csharp">
          {
            '// Cada capacidad es su propia interfaz\npublic interface IPrinter\n{\n    void Print(Document doc);\n}\n\npublic interface IScanner\n{\n    void Scan(Document doc);\n}\n\npublic interface IFax\n{\n    void Fax(Document doc);\n}\n\n// La impresora básica implementa solo lo que soporta\npublic class BasicInkjetPrinter : IPrinter\n{\n    public void Print(Document doc)\n    {\n        Console.WriteLine("Imprimiendo: " + doc.Name);\n    }\n}\n\n// El dispositivo multifunción implementa múltiples interfaces\npublic class OfficePrinter : IPrinter, IScanner, IFax\n{\n    public void Print(Document doc) { /* ... */ }\n    public void Scan(Document doc) { /* ... */ }\n    public void Fax(Document doc) { /* ... */ }\n}\n\n// Los clientes dependen SOLO de lo que necesitan\npublic class DocumentService\n{\n    private readonly IPrinter _printer;\n\n    public DocumentService(IPrinter printer)\n    {\n        // Esto funciona con BasicInkjetPrinter Y OfficePrinter\n        // Sin riesgo de NotSupportedException\n        _printer = printer;\n    }\n\n    public void PrintDocument(Document doc)\n    {\n        _printer.Print(doc); // Siempre seguro\n    }\n}'
          }
        </CodeBlock>

        <div className="rounded-lg border border-green-600 bg-green-50 p-4 my-6 dark:bg-green-950/30">
          <p className="font-semibold text-green-900 dark:text-green-100 mb-3">
            Beneficios de ISP Aquí:
          </p>
          <ul className="text-sm text-green-900 dark:text-green-100 space-y-2">
            <li>
              <span className="font-semibold">✓ Sin métodos muertos:</span> Cada
              clase implementa solo lo que realmente soporta.
            </li>
            <li>
              <span className="font-semibold">✓ Seguro para clientes:</span>{" "}
              DocumentService sabe que IPrinter.Print() siempre funciona, sin
              sorpresas en tiempo de ejecución.
            </li>
            <li>
              <span className="font-semibold">✓ Composición flexible:</span>{" "}
              Nuevos dispositivos pueden implementar cualquier combinación de
              interfaces.
            </li>
          </ul>
        </div>

        <p className="mt-6">
          Este patrón simple (dividir interfaces gordas en interfaces enfocadas)
          es la base de ISP. Ahora apliquemoslo a un sistema más grande y del
          mundo real.
        </p>
      </div>

      {/* Caso de Estudio: Interfaces de Repositorio */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Caso de Estudio: Interfaces de Repositorio en Gathering
        </h2>

        <p>
          La aplicación Gathering necesita repositorios para Sessions y
          Communities. Un enfoque ingenuo crearía una interfaz masiva para todo
          el acceso a datos. Veamos cómo luce eso, y cómo Gathering lo evita.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          La Violación: Una Interfaz de Repositorio Gorda
        </h3>

        <CodeBlock language="csharp">
          {
            "// ✗ VIOLACIÓN: Una interfaz para todo\npublic interface IDataRepository\n{\n    // Operaciones de Session\n    Task<Session?> GetSessionByIdAsync(Guid id, CancellationToken ct = default);\n    Task<IReadOnlyList<Session>> GetAllSessionsAsync(CancellationToken ct = default);\n    Task<IReadOnlyList<Session>> GetSessionsByCommunityIdAsync(\n        Guid communityId, CancellationToken ct = default);\n    Task<IReadOnlyList<Session>> GetActiveSessionsAsync(CancellationToken ct = default);\n    void AddSession(Session session);\n    void UpdateSession(Session session);\n    void RemoveSession(Session session);\n\n    // Operaciones de Community\n    Task<Community?> GetCommunityByIdAsync(Guid id, CancellationToken ct = default);\n    Task<IReadOnlyList<Community>> GetAllCommunitiesAsync(CancellationToken ct = default);\n    void AddCommunity(Community community);\n    void UpdateCommunity(Community community);\n    void RemoveCommunity(Community community);\n\n    // Operaciones de Resource\n    Task<IReadOnlyList<SessionResource>> GetResourcesBySessionIdAsync(\n        Guid sessionId, CancellationToken ct = default);\n    void AddResource(SessionResource resource);\n    void RemoveResource(SessionResource resource);\n\n    // Persistencia\n    Task<int> SaveChangesAsync(CancellationToken ct = default);\n}\n\n// CreateCommunityCommandHandler solo necesita operaciones de community,\n// pero depende de la interfaz COMPLETA\npublic class CreateCommunityCommandHandler\n{\n    private readonly IDataRepository _repository;\n\n    public CreateCommunityCommandHandler(IDataRepository repository)\n    {\n        _repository = repository;\n        // Este handler depende de 17+ métodos pero usa solo 2:\n        // AddCommunity() y SaveChangesAsync()\n    }\n\n    public async Task<Result<Guid>> HandleAsync(CreateCommunityCommand command,\n        CancellationToken ct)\n    {\n        var result = Community.Create(command.Name, command.Description);\n        if (result.IsFailure) return Result.Failure<Guid>(result.Error);\n\n        _repository.AddCommunity(result.Value);       // Usa 1 método\n        await _repository.SaveChangesAsync(ct);         // Usa 1 método\n        return Result.Success(result.Value.Id);\n        // ¿Los otros 15 métodos? Acoplamiento innecesario.\n    }\n}"
          }
        </CodeBlock>

        <div className="rounded-lg border border-red-600 bg-red-50 p-4 my-4 dark:bg-red-950/30">
          <p className="font-semibold text-red-900 dark:text-red-100 mb-3">
            Problemas con esta Interfaz Gorda:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-red-900 dark:text-red-100">
            <li>
              <span className="font-semibold">Acoplamiento innecesario:</span>{" "}
              CreateCommunityCommandHandler está acoplado a operaciones de
              session, resource y community, solo necesita operaciones de
              community.
            </li>
            <li>
              <span className="font-semibold">Difícil de probar:</span> Hacer
              mock de IDataRepository requiere implementar 17+ métodos aunque la
              prueba solo ejercite 2.
            </li>
            <li>
              <span className="font-semibold">Amplificación de cambios:</span>{" "}
              Agregar un nuevo método de consulta de session fuerza la
              recompilación de cada clase que depende de IDataRepository,
              incluyendo handlers de community que no tienen nada que ver con
              sessions.
            </li>
            <li>
              <span className="font-semibold">SRP violado:</span> La interfaz
              misma tiene múltiples responsabilidades (sessions, communities,
              resources, persistencia).
            </li>
          </ul>
        </div>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          El Enfoque Correcto: Interfaces Segregadas
        </h3>

        <p>
          Gathering resuelve esto elegantemente dividiendo responsabilidades en
          interfaces enfocadas. Cada interfaz sirve a un solo rol, y los
          clientes dependen solo de lo que necesitan.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          Paso 1: Repositorio Base Genérico
        </h3>

        <CodeBlock language="csharp">
          {
            "// De: Gathering.Domain/Abstractions/IRepository.cs\npublic interface IRepository<T> where T : Entity\n{\n    // Consultas\n    Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);\n    Task<IReadOnlyList<T>> GetAllAsync(CancellationToken cancellationToken = default);\n    Task<IReadOnlyList<T>> FindAsync(\n        Expression<Func<T, bool>> predicate,\n        CancellationToken cancellationToken = default);\n    Task<T?> FirstOrDefaultAsync(\n        Expression<Func<T, bool>> predicate,\n        CancellationToken cancellationToken = default);\n\n    // Verificaciones de existencia\n    Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default);\n    Task<bool> AnyAsync(\n        Expression<Func<T, bool>> predicate,\n        CancellationToken cancellationToken = default);\n\n    // Conteo\n    Task<int> CountAsync(CancellationToken cancellationToken = default);\n    Task<int> CountAsync(\n        Expression<Func<T, bool>> predicate,\n        CancellationToken cancellationToken = default);\n\n    // Comandos\n    void Add(T entity);\n    void AddRange(IEnumerable<T> entities);\n    void Update(T entity);\n    void UpdateRange(IEnumerable<T> entities);\n    void Remove(T entity);\n    void RemoveRange(IEnumerable<T> entities);\n}"
          }
        </CodeBlock>

        <p className="mt-4">
          Esta es una interfaz enfocada y cohesiva. Cada método trata sobre
          operaciones CRUD en un solo tipo de entidad. Cualquier repositorio
          para cualquier entidad necesita estas operaciones.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          Paso 2: Interfaces de Repositorio Especializadas
        </h3>

        <CodeBlock language="csharp">
          {
            "// De: Gathering.Domain/Sessions/ISessionRepository.cs\npublic interface ISessionRepository : IRepository<Session>\n{\n    // Solo consultas específicas de Session que van más allá del CRUD genérico\n    Task<IReadOnlyList<Session>> GetByCommunityIdAsync(\n        Guid communityId,\n        CancellationToken cancellationToken = default);\n\n    Task<IReadOnlyList<Session>> GetActiveSessionsAsync(\n        CancellationToken cancellationToken = default);\n\n    Task<IReadOnlyList<SessionResource>> GetResourcesBySessionIdAsync(\n        Guid sessionId,\n        CancellationToken cancellationToken = default);\n\n    void AddResource(SessionResource resource);\n}\n\n// De: Gathering.Domain/Communities/ICommunityRepository.cs\npublic interface ICommunityRepository : IRepository<Community>\n{\n    // ¡No se necesitan métodos adicionales!\n    // El IRepository<Community> base es suficiente\n}"
          }
        </CodeBlock>

        <div className="rounded-lg border border-blue-600 bg-blue-50 p-4 my-6 dark:bg-blue-950/30">
          <p className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
            Observa los Patrones Clave de ISP:
          </p>
          <ul className="text-sm text-blue-900 dark:text-blue-100 space-y-2">
            <li>
              <span className="font-semibold">ICommunityRepository</span> no
              agrega métodos. La interfaz genérica es suficiente. Ningún cliente
              se ve forzado a depender de métodos que solo las sessions
              necesitan.
            </li>
            <li>
              <span className="font-semibold">ISessionRepository</span> agrega
              solo consultas específicas de session. Métodos como
              GetByCommunityIdAsync no tienen sentido para communities.
            </li>
            <li>
              <span className="font-semibold">IUnitOfWork</span> está separado
              de los repositorios. La persistencia (SaveChanges) es una
              preocupación diferente al acceso a datos.
            </li>
          </ul>
        </div>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          Paso 3: Preocupación de Persistencia Separada
        </h3>

        <CodeBlock language="csharp">
          {
            "// De: Gathering.Domain/Abstractions/IUnitOfWork.cs\npublic interface IUnitOfWork : IDisposable\n{\n    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);\n}"
          }
        </CodeBlock>

        <p className="mt-4">
          IUnitOfWork es una interfaz de un solo método. Es el ejemplo
          definitivo de ISP: una interfaz, una responsabilidad. Cualquier
          handler que necesite persistencia depende de esto, nada más.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          Paso 4: Los Handlers Dependen Solo de lo que Necesitan
        </h3>

        <CodeBlock language="csharp">
          {
            "// De: Gathering.Application/Communities/Create/CreateCommunityCommandHandler.cs\npublic sealed class CreateCommunityCommandHandler \n    : ICommandHandler<CreateCommunityCommand, Guid>\n{\n    private readonly ICommunityRepository _communityRepository;\n    private readonly IUnitOfWork _unitOfWork;\n    private readonly IValidator<CreateCommunityCommand> _validator;\n    private readonly IImageStorageService _imageStorageService;\n\n    public CreateCommunityCommandHandler(\n        ICommunityRepository communityRepository,\n        IUnitOfWork unitOfWork,\n        IValidator<CreateCommunityCommand> validator,\n        IImageStorageService imageStorageService)\n    {\n        _communityRepository = communityRepository;\n        _unitOfWork = unitOfWork;\n        _validator = validator;\n        _imageStorageService = imageStorageService;\n    }\n\n    public async Task<Result<Guid>> HandleAsync(\n        CreateCommunityCommand command, \n        CancellationToken cancellationToken = default)\n    {\n        // Validación...\n        var result = Community.Create(command.Name, command.Description);\n        if (result.IsFailure) return Result.Failure<Guid>(result.Error);\n\n        _communityRepository.Add(result.Value);\n        await _unitOfWork.SaveChangesAsync(cancellationToken);\n\n        return Result.Success(result.Value.Id);\n    }\n}"
          }
        </CodeBlock>

        <div className="rounded-lg border border-emerald-600 bg-emerald-50 p-4 my-4 dark:bg-emerald-950/30">
          <p className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
            ISP en Acción:
          </p>
          <ul className="text-sm space-y-2 text-emerald-900 dark:text-emerald-100">
            <li>
              <span className="font-semibold">ICommunityRepository:</span> Solo
              CRUD de community. Sin métodos de session contaminando la
              dependencia.
            </li>
            <li>
              <span className="font-semibold">IUnitOfWork:</span> Solo
              SaveChangesAsync. No mezclado con consultas de repositorio.
            </li>
            <li>
              <span className="font-semibold">IImageStorageService:</span> Solo
              Upload y Delete. No un IFileService gordo con 20 métodos.
            </li>
            <li>
              <span className="font-semibold">IValidator:</span> Solo valida
              CreateCommunityCommand. No un validador genérico para todos los
              comandos.
            </li>
          </ul>
        </div>
      </div>

      {/* Caso de Estudio: Interfaces CQRS */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Caso de Estudio: Segregación de Interfaces CQRS
        </h2>

        <p>
          El patrón CQRS (Command Query Responsibility Segregation) de Gathering
          es otro poderoso ejemplo de ISP. En lugar de un solo{" "}
          <span className="font-mono">IRequestHandler</span> que maneja tanto
          lecturas como escrituras, los comandos y consultas tienen interfaces
          separadas.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          La Violación: Un Handler para Todo
        </h3>

        <CodeBlock language="csharp">
          {
            "// ✗ VIOLACIÓN: Una interfaz gorda para todas las operaciones\npublic interface IHandler<TRequest, TResponse>\n{\n    Task<TResponse> HandleAsync(TRequest request, CancellationToken ct);\n    \n    // Los comandos necesitan validación, las consultas no\n    Task<ValidationResult> ValidateAsync(TRequest request);\n    \n    // Los comandos necesitan unit of work, las consultas no\n    Task SaveChangesAsync(CancellationToken ct);\n    \n    // Las consultas necesitan paginación, los comandos no\n    Task<PagedResult<TResponse>> HandlePagedAsync(\n        TRequest request, int page, int pageSize);\n}\n\n// Un handler de consulta es forzado a implementar métodos específicos de comandos\npublic class GetSessionByIdHandler : IHandler<GetSessionQuery, SessionDto>\n{\n    public async Task<SessionDto> HandleAsync(\n        GetSessionQuery request, CancellationToken ct)\n    {\n        // Esto funciona bien\n        return await _repository.GetByIdAsync(request.Id, ct);\n    }\n\n    public Task<ValidationResult> ValidateAsync(GetSessionQuery request)\n    {\n        // Las consultas no necesitan FluentValidation - forzado a implementar\n        throw new NotImplementedException();\n    }\n\n    public Task SaveChangesAsync(CancellationToken ct)\n    {\n        // Las consultas no escriben datos - forzado a implementar\n        throw new NotImplementedException();\n    }\n\n    public Task<PagedResult<SessionDto>> HandlePagedAsync(\n        GetSessionQuery request, int page, int pageSize)\n    {\n        // No todas las consultas necesitan paginación - forzado a implementar\n        throw new NotImplementedException();\n    }\n}"
          }
        </CodeBlock>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          El Enfoque Correcto: Interfaces Segregadas de Comando y Consulta
        </h3>

        <CodeBlock language="csharp">
          {
            "// De: Gathering.Application/Abstractions/ICommand.cs\npublic interface ICommand : IRequest<Result>, IBaseCommand { }\n\npublic interface ICommand<TResponse> : IRequest<Result<TResponse>>, IBaseCommand { }\n\n// De: Gathering.Application/Abstractions/ICommandHandler.cs\npublic interface ICommandHandler<TCommand> : IRequestHandler<TCommand, Result>\n    where TCommand : ICommand { }\n\npublic interface ICommandHandler<TCommand, TResponse> \n    : IRequestHandler<TCommand, Result<TResponse>>\n    where TCommand : ICommand<TResponse> { }\n\n// De: Gathering.Application/Abstractions/IQuery.cs\npublic interface IQuery<TResponse> : IRequest<Result<TResponse>> { }\n\n// De: Gathering.Application/Abstractions/IQueryHandler.cs\npublic interface IQueryHandler<TQuery, TResponse> \n    : IRequestHandler<TQuery, Result<TResponse>>\n    where TQuery : IQuery<TResponse> { }"
          }
        </CodeBlock>

        <p className="mt-4">
          Cada interfaz tiene{" "}
          <span className="font-semibold">exactamente un método</span> (heredado
          de IRequestHandler): el método Handle. Pero la segregación está en las{" "}
          <span className="font-semibold">restricciones de tipo</span>:
        </p>

        <ul className="list-disc list-inside space-y-2">
          <li>
            <span className="font-semibold">ICommandHandler</span> maneja solo
            tipos ICommand. Los comandos modifican estado y retornan Result.
          </li>
          <li>
            <span className="font-semibold">IQueryHandler</span> maneja solo
            tipos IQuery. Las consultas leen estado y retornan datos.
          </li>
          <li>
            Ningún handler es forzado a implementar métodos de la otra
            categoría.
          </li>
        </ul>

        <CodeBlock language="csharp">
          {
            "// Un handler de comando - solo implementa manejo de comandos\npublic sealed class CreateSessionCommandHandler \n    : ICommandHandler<CreateSessionCommand, Guid>\n{\n    private readonly ISessionRepository _sessionRepository;\n    private readonly ICommunityRepository _communityRepository;\n    private readonly IUnitOfWork _unitOfWork;\n    private readonly IValidator<CreateSessionCommand> _validator;\n    private readonly IImageStorageService _imageStorageService;\n\n    public CreateSessionCommandHandler(\n        ISessionRepository sessionRepository,\n        ICommunityRepository communityRepository,\n        IUnitOfWork unitOfWork,\n        IValidator<CreateSessionCommand> validator,\n        IImageStorageService imageStorageService)\n    {\n        _sessionRepository = sessionRepository;\n        _communityRepository = communityRepository;\n        _unitOfWork = unitOfWork;\n        _validator = validator;\n        _imageStorageService = imageStorageService;\n    }\n\n    public async Task<Result<Guid>> HandleAsync(\n        CreateSessionCommand request, \n        CancellationToken cancellationToken = default)\n    {\n        // Validar, verificar que community existe, subir imagen, crear session, guardar\n        // ...\n        _sessionRepository.Add(sessionResult.Value);\n        await _unitOfWork.SaveChangesAsync(cancellationToken);\n        return Result.Success(sessionResult.Value.Id);\n    }\n}"
          }
        </CodeBlock>
      </div>

      {/* Caso de Estudio: Almacenamiento de Imágenes */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Caso de Estudio: Interfaz de Almacenamiento Enfocada
        </h2>

        <p>
          Otro patrón ISP en Gathering es la abstracción de almacenamiento de
          imágenes. En lugar de un{" "}
          <span className="font-mono">IFileService</span> gordo que maneje todas
          las operaciones de archivo imaginables, Gathering define una interfaz
          enfocada para exactamente lo que la aplicación necesita.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          La Violación: Un Servicio de Archivos Navaja Suiza
        </h3>

        <CodeBlock language="csharp">
          {
            '// ✗ VIOLACIÓN: Demasiadas capacidades en una sola interfaz\npublic interface IFileService\n{\n    // Operaciones de imagen (necesarias para Gathering)\n    Task<Result<string>> UploadImageAsync(Stream stream, string fileName,\n        string contentType, string entityType, CancellationToken ct);\n    Task<Result> DeleteImageAsync(string url, CancellationToken ct);\n\n    // Operaciones de documento (no necesarias para Gathering)\n    Task<Result<string>> UploadDocumentAsync(Stream stream, string fileName,\n        CancellationToken ct);\n    Task<Result<byte[]>> DownloadDocumentAsync(string url, CancellationToken ct);\n    Task<Result<string>> ConvertToPdfAsync(string documentUrl, CancellationToken ct);\n\n    // Operaciones de video (no necesarias para Gathering)\n    Task<Result<string>> UploadVideoAsync(Stream stream, string fileName,\n        CancellationToken ct);\n    Task<Result<string>> GenerateThumbnailAsync(string videoUrl, CancellationToken ct);\n    Task<Result<TimeSpan>> GetVideoDurationAsync(string videoUrl, CancellationToken ct);\n\n    // Operaciones generales de archivo (no necesarias para handlers)\n    Task<bool> FileExistsAsync(string url, CancellationToken ct);\n    Task<Result<long>> GetFileSizeAsync(string url, CancellationToken ct);\n    Task<Result<IReadOnlyList<string>>> ListFilesAsync(string prefix, CancellationToken ct);\n}\n\n// CreateCommunityCommandHandler depende de 12 métodos pero usa solo 2\npublic class CreateCommunityCommandHandler\n{\n    private readonly IFileService _fileService;\n    // Los 12 métodos son visibles y "disponibles" pero irrelevantes\n}'
          }
        </CodeBlock>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          El Enfoque Correcto: Solo lo que Necesitas
        </h3>

        <CodeBlock language="csharp">
          {
            "// De: Gathering.Application/Abstractions/IImageStorageService.cs\npublic interface IImageStorageService\n{\n    Task<Result<string>> UploadImageAsync(\n        Stream imageStream,\n        string fileName,\n        string contentType,\n        string entityType,\n        CancellationToken cancellationToken = default);\n\n    Task<Result> DeleteImageAsync(\n        string imageUrl, \n        CancellationToken cancellationToken = default);\n}"
          }
        </CodeBlock>

        <p className="mt-4">
          Dos métodos. Esa es la interfaz completa. Cada handler que necesita
          operaciones de imagen depende de exactamente lo que necesita: subir y
          eliminar, nada más.
        </p>

        <CodeBlock language="csharp">
          {
            '// De: Gathering.Infrastructure/Storage/AzureBlobStorageService.cs\ninternal sealed class AzureBlobStorageService(\n    BlobServiceClient blobServiceClient) : IImageStorageService\n{\n    private const string ContainerName = "images";\n\n    public async Task<Result<string>> UploadImageAsync(\n        Stream imageStream, string fileName, string contentType,\n        string entityType, CancellationToken cancellationToken = default)\n    {\n        try\n        {\n            var containerClient = blobServiceClient\n                .GetBlobContainerClient(ContainerName);\n            await containerClient.CreateIfNotExistsAsync(\n                cancellationToken: cancellationToken);\n\n            var extension = Path.GetExtension(fileName).ToLower();\n            var blobName = $"{entityType}/{Guid.NewGuid()}{extension}";\n            var blobClient = containerClient.GetBlobClient(blobName);\n\n            imageStream.Seek(0, SeekOrigin.Begin);\n\n            var uploadOptions = new BlobUploadOptions\n            {\n                HttpHeaders = new BlobHttpHeaders { ContentType = contentType }\n            };\n\n            await blobClient.UploadAsync(\n                imageStream, uploadOptions, cancellationToken);\n\n            return Result.Success(blobClient.Uri.AbsoluteUri);\n        }\n        catch (Exception ex)\n        {\n            return Result.Failure<string>(\n                ImageStorageError.UploadFailed(ex.Message));\n        }\n    }\n\n    public async Task<Result> DeleteImageAsync(\n        string imageUrl, CancellationToken cancellationToken = default)\n    {\n        try\n        {\n            var uri = new Uri(imageUrl);\n            var blobClient = new BlobClient(uri);\n            await blobClient.DeleteIfExistsAsync(\n                cancellationToken: cancellationToken);\n\n            return Result.Success();\n        }\n        catch (Exception ex)\n        {\n            return Result.Failure(\n                ImageStorageError.DeleteFailed(ex.Message));\n        }\n    }\n}'
          }
        </CodeBlock>

        <div className="rounded-lg border border-green-600 bg-green-50 p-4 my-6 dark:bg-green-950/30">
          <p className="font-semibold text-green-900 dark:text-green-100 mb-3">
            Beneficios de ISP en la Práctica:
          </p>
          <ul className="text-sm text-green-900 dark:text-green-100 space-y-2">
            <li>
              <span className="font-semibold">✓ Fácil de implementar:</span>{" "}
              AzureBlobStorageService implementa 2 métodos, no 12. La
              implementación es enfocada y directa.
            </li>
            <li>
              <span className="font-semibold">✓ Fácil de mockear:</span> Las
              pruebas solo necesitan configurar 2 métodos. La preparación de
              pruebas es mínima.
            </li>
            <li>
              <span className="font-semibold">✓ Fácil de intercambiar:</span>{" "}
              Cambiar de Azure a AWS significa implementar 2 métodos en una
              nueva clase, no 12.
            </li>
            <li>
              <span className="font-semibold">✓ Interfaz estable:</span> Agregar
              características de procesamiento de video no afecta a
              IImageStorageService. Esas irían en un IVideoStorageService
              separado.
            </li>
          </ul>
        </div>
      </div>

      {/* Sección TypeScript */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          ISP en TypeScript
        </h2>

        <p>
          Los mismos principios aplican en TypeScript. Aquí está el patrón de
          repositorio y almacenamiento traducido a un contexto Node.js:
        </p>

        <CodeBlock language="typescript">
          {
            '// Interfaz de repositorio genérico - enfocada en CRUD\ninterface IRepository<T extends Entity> {\n  getById(id: string): Promise<T | null>;\n  getAll(): Promise<ReadonlyArray<T>>;\n  find(predicate: (entity: T) => boolean): Promise<ReadonlyArray<T>>;\n  exists(id: string): Promise<boolean>;\n\n  add(entity: T): void;\n  update(entity: T): void;\n  remove(entity: T): void;\n}\n\n// Interfaz de persistencia segregada\ninterface IUnitOfWork {\n  saveChanges(): Promise<number>;\n}\n\n// Extensión específica de Session\ninterface ISessionRepository extends IRepository<Session> {\n  getByCommunityId(communityId: string): Promise<ReadonlyArray<Session>>;\n  getActiveSessions(): Promise<ReadonlyArray<Session>>;\n}\n\n// Repositorio de Community - no necesita métodos extra\ninterface ICommunityRepository extends IRepository<Community> {\n  // El IRepository base es suficiente\n}\n\n// Almacenamiento de imagen enfocado - solo lo que la app necesita\ninterface IImageStorageService {\n  uploadImage(\n    stream: NodeJS.ReadableStream,\n    fileName: string,\n    contentType: string,\n    entityType: string\n  ): Promise<Result<string>>;\n\n  deleteImage(imageUrl: string): Promise<Result<void>>;\n}\n\n// ✗ Violación de interfaz GORDA\ninterface IFileService {\n  uploadImage(stream: NodeJS.ReadableStream, fileName: string): Promise<Result<string>>;\n  deleteImage(url: string): Promise<Result<void>>;\n  uploadDocument(stream: NodeJS.ReadableStream, fileName: string): Promise<Result<string>>;\n  downloadDocument(url: string): Promise<Result<Buffer>>;\n  convertToPdf(documentUrl: string): Promise<Result<string>>;\n  uploadVideo(stream: NodeJS.ReadableStream, fileName: string): Promise<Result<string>>;\n  generateThumbnail(videoUrl: string): Promise<Result<string>>;\n  // 7 métodos... y creciendo\n}\n\n  // ✓ Handler depende solo de interfaces enfocadas\nclass CreateCommunityHandler {\n  constructor(\n    private communityRepository: ICommunityRepository,\n    private unitOfWork: IUnitOfWork,\n    private imageStorage: IImageStorageService\n  ) {}\n\n  async handle(command: CreateCommunityCommand): Promise<Result<string>> {\n    const result = Community.create(command.name, command.description);\n    if (!result.isSuccess) return failure(result.error);\n\n    if (command.imageStream) {\n      const uploadResult = await this.imageStorage.uploadImage(\n        command.imageStream,\n        command.imageFileName,\n        command.imageContentType,\n        "communities"\n      );\n\n      if (!uploadResult.isSuccess) {\n        return failure(uploadResult.error);\n      }\n    }\n\n    this.communityRepository.add(result.value);\n    await this.unitOfWork.saveChanges();\n\n    return success(result.value.id);\n  }\n}'
          }
        </CodeBlock>
      </div>

      {/* Beneficios */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Beneficios de Aplicar ISP
        </h2>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          1. Acoplamiento Reducido
        </h3>
        <p>
          Cada handler depende de exactamente las interfaces que necesita. Los
          cambios en ISessionRepository no afectan a
          CreateCommunityCommandHandler. Los cambios en IImageStorageService no
          afectan a handlers de consulta que nunca suben imágenes.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          2. Pruebas Más Simples
        </h3>
        <p>
          Hacer mock de IUnitOfWork significa implementar un método. Hacer mock
          de IImageStorageService significa implementar dos. Compara eso con
          hacer mock de un IDataRepository de 17 métodos para cada prueba.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          3. Intención Más Clara
        </h3>
        <p>
          Un constructor que recibe ICommunityRepository, IUnitOfWork e
          IImageStorageService te dice exactamente qué hace el handler: gestiona
          communities, persiste cambios y maneja imágenes. Un constructor que
          recibe IDataRepository no te dice nada.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          4. Evolución Independiente
        </h3>
        <p>
          Puedes agregar nuevos métodos a ISessionRepository (por ejemplo,
          GetUpcomingSessionsAsync) sin tocar ICommunityRepository ni sus
          implementaciones. Cada interfaz evoluciona independientemente.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          5. Mejor Registro de DI
        </h3>
        <p>
          Con interfaces enfocadas, la inyección de dependencias es precisa.
          Registras cada interfaz con su implementación. Con una interfaz gorda,
          un solo registro maneja todo, haciendo más difícil intercambiar
          componentes individuales.
        </p>
      </div>

      {/* Trampas */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Trampas del Mundo Real
        </h2>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          Trampa 1: Explosión de Interfaces
        </h3>
        <p>
          Dividir demasiado agresivamente crea docenas de interfaces de un solo
          método que son difíciles de navegar. El objetivo no es minimizar
          métodos por interfaz sino agrupar{" "}
          <span className="font-semibold">operaciones cohesivas</span>.
          IRepository agrupa operaciones CRUD porque naturalmente pertenecen
          juntas.
        </p>
        <p className="text-sm italic mt-2">
          Guía: Si los métodos siempre cambian juntos y sirven al mismo cliente,
          mantenlos en una sola interfaz.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          Trampa 2: Dividir Basándose en la Implementación, No en las
          Necesidades del Cliente
        </h3>
        <p>
          ISP se trata de la{" "}
          <span className="font-semibold">perspectiva del cliente</span>, no del
          implementador. No dividas una interfaz porque la implementación es
          compleja, divívela porque diferentes clientes necesitan diferentes
          subconjuntos.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          Trampa 3: Interfaces Marcadoras sin Propósito
        </h3>
        <p>
          ICommunityRepository no agrega métodos a IRepository. Eso está bien,
          existe como un tipo distinto para inyección de dependencias y
          extensión futura. Pero crear interfaces vacías &ldquo;por si
          acaso&rdquo; sin un propósito claro de DI o extensión agrega ruido.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          Trampa 4: Ignorar la Herencia de Interfaces
        </h3>
        <p>
          C# soporta herencia de interfaces (ISessionRepository extiende
          IRepository). Usa esto para componer interfaces enfocadas en lugar de
          duplicar firmas de métodos a través de interfaces separadas.
        </p>
      </div>

      {/* Lista de Verificación */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Lista de Verificación: Detectando Violaciones de ISP
        </h2>

        <div className="space-y-3 my-4">
          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
            <input
              type="checkbox"
              className="mt-1"
              disabled
              readOnly
              defaultChecked
            />
            <label>
              ¿Las implementaciones lanzan{" "}
              <span className="font-mono">NotImplementedException</span> para
              algunos métodos de la interfaz?
            </label>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
            <input
              type="checkbox"
              className="mt-1"
              disabled
              readOnly
              defaultChecked
            />
            <label>
              ¿Los clientes dependen de interfaces donde usan menos de la mitad
              de los métodos?
            </label>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
            <input
              type="checkbox"
              className="mt-1"
              disabled
              readOnly
              defaultChecked
            />
            <label>
              ¿Agregar un método a una interfaz fuerza cambios en clases que no
              tienen nada que ver con ese método?
            </label>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
            <input
              type="checkbox"
              className="mt-1"
              disabled
              readOnly
              defaultChecked
            />
            <label>
              ¿Es difícil hacer mock de una interfaz en pruebas porque tiene
              demasiados métodos?
            </label>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-border p-4">
            <input
              type="checkbox"
              className="mt-1"
              disabled
              readOnly
              defaultChecked
            />
            <label>
              ¿La interfaz mezcla diferentes categorías de operaciones (por
              ejemplo, imágenes, documentos y videos)?
            </label>
          </div>
        </div>

        <p>
          Si respondes &ldquo;sí&rdquo; a cualquiera de estas, probablemente se
          esté violando ISP.
        </p>
      </div>

      {/* Conclusión */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Conclusión</h2>

        <p>
          El Principio de Segregación de Interfaces transforma cómo diseñas
          contratos. En lugar de interfaces de talla única que fuerzan a los
          clientes a depender de métodos que nunca usan, creas interfaces
          enfocadas que coinciden con lo que cada cliente realmente necesita.
        </p>

        <p>
          Gathering demuestra esto a través de su jerarquía de repositorios
          (IRepository → ISessionRepository / ICommunityRepository), sus
          abstracciones CQRS (ICommandHandler vs IQueryHandler), y su interfaz
          de almacenamiento (IImageStorageService con solo 2 métodos). Cada
          interfaz es cohesiva, enfocada y fácil de implementar y probar.
        </p>

        <p>
          La idea clave:{" "}
          <span className="font-semibold">
            diseña interfaces desde la perspectiva del cliente, no del
            implementador
          </span>
          . Pregunta &ldquo;¿qué necesita este consumidor?&rdquo;, no
          &ldquo;¿qué puede hacer esta implementación?&rdquo;
        </p>

        <p>
          En el próximo artículo, exploramos el Principio de Inversión de
          Dependencias, que asegura que los módulos de alto nivel dependen de
          abstracciones en lugar de implementaciones concretas, la pieza final
          que hace que todos los principios SOLID funcionen juntos.
        </p>
      </div>
    </>
  );
}
