import { CodeBlock } from "@/components/code-block";

export function DipContentEs() {
  return (
    <>
      {/* Introducción */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Introducción</h2>
        <p>
          El Principio de Inversión de Dependencias (DIP) establece dos cosas:{" "}
          <span className="font-semibold">
            los módulos de alto nivel no deben depender de módulos de bajo
            nivel, ambos deben depender de abstracciones
          </span>
          . Y:{" "}
          <span className="font-semibold">
            las abstracciones no deben depender de detalles, los detalles deben
            depender de abstracciones
          </span>
          .
        </p>
        <p>
          En la práctica, DIP significa que tu lógica de negocio (comandos,
          handlers, servicios de dominio) nunca debe referenciar directamente
          detalles de infraestructura (conexiones a bases de datos, SDKs de
          nube, clientes HTTP). En su lugar, referencian interfaces. Las
          implementaciones concretas se inyectan en tiempo de ejecución a través
          de un contenedor de inyección de dependencias.
        </p>
        <p>
          Este principio es la piedra angular de SOLID. SRP asegura que cada
          clase tiene una responsabilidad. OCP permite extensión sin
          modificación. LSP garantiza que los subtipos son seguros. ISP mantiene
          las interfaces enfocadas. DIP los une a todos asegurando que la
          dirección de las dependencias fluya desde los detalles concretos hacia
          las abstracciones estables.
        </p>
        <p>
          En este artículo, exploramos DIP a través de un escenario real:
          construir un sistema de gestión de Comunidad de Práctica. Verás cómo
          la arquitectura de Gathering invierte dependencias a través de cada
          capa, y qué sucede cuando te saltas este paso.
        </p>
      </div>

      {/* El Problema */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          El Problema: Código de Alto Nivel Encadenado a Detalles de Bajo Nivel
        </h2>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          Un Ejemplo Simple: Servicio de Notificaciones
        </h3>

        <p>
          Antes de sumergirnos en el código de Gathering, veamos una violación
          simple de DIP: un servicio de notificaciones que depende directamente
          de una librería de email. Esto ilustra el principio central sin
          necesitar contexto de aplicación.
        </p>

        <h4 className="text-base font-semibold text-foreground mt-4">
          Sin DIP: Dependencia Directa de la Implementación
        </h4>

        <CodeBlock language="csharp">
          {
            'public class OrderService\n{\n    // Dependencia directa de una librería concreta de email\n    private readonly SmtpClient _smtpClient;\n    private readonly SqlConnection _database;\n\n    public OrderService()\n    {\n        // Crea sus propias dependencias - fuertemente acoplado\n        _smtpClient = new SmtpClient("smtp.company.com", 587);\n        _database = new SqlConnection(\n            "Server=prod-db;Database=Orders;...");\n    }\n\n    public void PlaceOrder(Order order)\n    {\n        // Lógica de negocio mezclada con infraestructura\n        _database.Open();\n        var cmd = new SqlCommand(\n            "INSERT INTO Orders ...", _database);\n        cmd.ExecuteNonQuery();\n        _database.Close();\n\n        // Directamente acoplado a implementación SMTP\n        var message = new MailMessage(\n            "noreply@company.com",\n            order.CustomerEmail,\n            "Orden Confirmada",\n            $"Tu orden {order.Id} ha sido realizada.");\n        _smtpClient.Send(message);\n    }\n}'
          }
        </CodeBlock>

        <p className="mt-4">
          <span className="font-semibold">El problema:</span> OrderService crea
          directamente SmtpClient y SqlConnection. No puedes probar sin un
          servidor SMTP real y una base de datos. No puedes cambiar de SMTP a
          SendGrid, o de SQL Server a PostgreSQL, sin reescribir OrderService.
          La política de alto nivel (realizar pedidos) está encadenada a
          detalles de bajo nivel (SMTP, SQL).
        </p>

        <h4 className="text-base font-semibold text-foreground mt-4">
          Con DIP: Depender de Abstracciones
        </h4>

        <CodeBlock language="csharp">
          {
            '// Abstracciones definidas por el módulo de alto nivel\npublic interface IOrderRepository\n{\n    Task SaveOrderAsync(Order order, CancellationToken ct = default);\n}\n\npublic interface INotificationService\n{\n    Task SendOrderConfirmationAsync(Order order, CancellationToken ct = default);\n}\n\n// El módulo de alto nivel depende de abstracciones\npublic class OrderService\n{\n    private readonly IOrderRepository _repository;\n    private readonly INotificationService _notificationService;\n\n    // Las dependencias son INYECTADAS, no creadas\n    public OrderService(\n        IOrderRepository repository,\n        INotificationService notificationService)\n    {\n        _repository = repository;\n        _notificationService = notificationService;\n    }\n\n    public async Task PlaceOrderAsync(Order order, CancellationToken ct)\n    {\n        await _repository.SaveOrderAsync(order, ct);\n        await _notificationService.SendOrderConfirmationAsync(order, ct);\n    }\n}\n\n// Los módulos de bajo nivel implementan las abstracciones\npublic class SqlOrderRepository : IOrderRepository\n{\n    private readonly DbContext _dbContext;\n\n    public SqlOrderRepository(DbContext dbContext)\n    {\n        _dbContext = dbContext;\n    }\n\n    public async Task SaveOrderAsync(Order order, CancellationToken ct)\n    {\n        _dbContext.Orders.Add(order);\n        await _dbContext.SaveChangesAsync(ct);\n    }\n}\n\npublic class SmtpNotificationService : INotificationService\n{\n    private readonly SmtpClient _smtpClient;\n\n    public SmtpNotificationService(SmtpClient smtpClient)\n    {\n        _smtpClient = smtpClient;\n    }\n\n    public async Task SendOrderConfirmationAsync(\n        Order order, CancellationToken ct)\n    {\n        var message = new MailMessage(\n            "noreply@company.com",\n            order.CustomerEmail,\n            "Orden Confirmada",\n            $"Tu orden {order.Id} ha sido realizada.");\n        await _smtpClient.SendMailAsync(message, ct);\n    }\n}'
          }
        </CodeBlock>

        <div className="rounded-lg border border-green-600 bg-green-50 p-4 my-6 dark:bg-green-950/30">
          <p className="font-semibold text-green-900 dark:text-green-100 mb-3">
            Beneficios de DIP Aquí:
          </p>
          <ul className="text-sm text-green-900 dark:text-green-100 space-y-2">
            <li>
              <span className="font-semibold">✓ Testeable:</span> Inyecta
              implementaciones mock. No se necesita un servidor real de base de
              datos o SMTP.
            </li>
            <li>
              <span className="font-semibold">✓ Intercambiable:</span> Cambia de
              SMTP a SendGrid creando una nueva implementación de
              INotificationService. OrderService nunca cambia.
            </li>
            <li>
              <span className="font-semibold">✓ Desacoplado:</span> OrderService
              no sabe nada sobre SQL, SMTP ni ninguna infraestructura. Solo
              habla en abstracciones.
            </li>
          </ul>
        </div>

        <p className="mt-6">
          Este patrón simple (inyectar abstracciones en lugar de crear
          dependencias concretas) es la base de DIP. Ahora apliquemoslo a un
          sistema más grande y del mundo real.
        </p>
      </div>

      {/* Caso de Estudio: Arquitectura de Gathering */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Caso de Estudio: Arquitectura de Dependencias en Gathering
        </h2>

        <p>
          La arquitectura de Gathering es un ejemplo de libro de texto de DIP
          aplicado a nivel arquitectónico. El proyecto tiene cuatro capas, y el
          flujo de dependencias está deliberadamente invertido:
        </p>

        <div className="rounded-lg border border-blue-600 bg-blue-50 p-4 my-6 dark:bg-blue-950/30">
          <p className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
            Flujo de Dependencias por Capas:
          </p>
          <ul className="text-sm text-blue-900 dark:text-blue-100 space-y-2">
            <li>
              <span className="font-semibold">Gathering.SharedKernel:</span>{" "}
              Tipos base (Entity, Result, Error). No depende de nada.
            </li>
            <li>
              <span className="font-semibold">Gathering.Domain:</span> Entidades
              e interfaces de repositorio. Depende solo de SharedKernel.
            </li>
            <li>
              <span className="font-semibold">Gathering.Application:</span>{" "}
              Handlers de comandos, handlers de consultas, abstracciones.
              Depende de Domain y SharedKernel.
            </li>
            <li>
              <span className="font-semibold">Gathering.Infrastructure:</span>{" "}
              EF Core, Azure Blob Storage, implementaciones. Depende de
              Application y Domain,
              <span className="font-semibold">
                implementa sus abstracciones
              </span>
              .
            </li>
            <li>
              <span className="font-semibold">Gathering.Api:</span> Endpoints y
              raíz de composición de DI. Conecta todo.
            </li>
          </ul>
        </div>

        <p>
          La idea crítica: Infrastructure depende de Domain y Application, no al
          revés. La lógica de negocio de alto nivel define las interfaces; la
          infraestructura de bajo nivel las implementa.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          La Violación: Handler Acoplado al SDK de Azure
        </h3>

        <p>
          Imagina que un desarrollador se salta la abstracción y referencia
          Azure Blob Storage directamente en el handler de comando:
        </p>

        <CodeBlock language="csharp">
          {
            '// ✗ VIOLACIÓN: Handler de alto nivel depende directamente del SDK de Azure\nusing Azure.Storage.Blobs;\nusing Azure.Storage.Blobs.Models;\n\npublic sealed class CreateCommunityCommandHandler\n{\n    private readonly ApplicationDbContext _dbContext;\n    private readonly BlobServiceClient _blobServiceClient;\n\n    public CreateCommunityCommandHandler(\n        ApplicationDbContext dbContext,\n        BlobServiceClient blobServiceClient)  // ¡Dependencia directa del SDK de Azure!\n    {\n        _dbContext = dbContext;\n        _blobServiceClient = blobServiceClient;\n    }\n\n    public async Task<Result<Guid>> HandleAsync(\n        CreateCommunityCommand command, CancellationToken ct)\n    {\n        var result = Community.Create(command.Name, command.Description);\n        if (result.IsFailure) return Result.Failure<Guid>(result.Error);\n\n        // Lógica de negocio contaminada con código específico de Azure\n        if (command.ImageStream is not null)\n        {\n            var containerClient = _blobServiceClient\n                .GetBlobContainerClient("images");\n            await containerClient.CreateIfNotExistsAsync(\n                cancellationToken: ct);\n\n            var extension = Path.GetExtension(command.ImageFileName).ToLower();\n            var blobName = $"communities/{Guid.NewGuid()}{extension}";\n            var blobClient = containerClient.GetBlobClient(blobName);\n\n            command.ImageStream.Seek(0, SeekOrigin.Begin);\n            var uploadOptions = new BlobUploadOptions\n            {\n                HttpHeaders = new BlobHttpHeaders \n                { \n                    ContentType = command.ImageContentType \n                }\n            };\n\n            await blobClient.UploadAsync(\n                command.ImageStream, uploadOptions, ct);\n\n            // Construcción de URI específica de Azure\n            result.Value.Update(\n                command.Name, command.Description, \n                blobClient.Uri.AbsoluteUri);\n        }\n\n        _dbContext.Communities.Add(result.Value);\n        await _dbContext.SaveChangesAsync(ct);\n\n        return Result.Success(result.Value.Id);\n    }\n}'
          }
        </CodeBlock>

        <div className="rounded-lg border border-red-600 bg-red-50 p-4 my-4 dark:bg-red-950/30">
          <p className="font-semibold text-red-900 dark:text-red-100 mb-3">
            Problemas con Dependencias Directas:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-red-900 dark:text-red-100">
            <li>
              <span className="font-semibold">No testeable:</span> Las pruebas
              requieren una cuenta real de Azure Blob Storage. No puedes hacer
              pruebas unitarias de la lógica de negocio sin infraestructura en
              la nube.
            </li>
            <li>
              <span className="font-semibold">Atado a Azure:</span> Cambiar a
              AWS S3 o almacenamiento local significa reescribir el handler. La
              lógica de negocio y la infraestructura son inseparables.
            </li>
            <li>
              <span className="font-semibold">
                La capa Application referencia Infrastructure:
              </span>{" "}
              El handler (capa Application) importa Azure.Storage.Blobs (detalle
              de Infrastructure). La flecha de dependencia apunta en la
              dirección equivocada.
            </li>
            <li>
              <span className="font-semibold">Abstracciones con fugas:</span>{" "}
              BlobServiceClient, BlobContainerClient, BlobUploadOptions, todos
              tipos específicos de Azure se filtran en la lógica de negocio.
            </li>
            <li>
              <span className="font-semibold">
                Responsabilidades mezcladas:
              </span>{" "}
              El handler sabe cómo Azure genera nombres de blob, cómo establecer
              tipos de contenido y cómo funcionan las URIs. Ese no es su
              trabajo.
            </li>
          </ul>
        </div>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          El Enfoque Correcto: Abstracciones Propiedad de los Módulos de Alto
          Nivel
        </h3>

        <p>
          Gathering invierte esta dependencia. La capa Application define la
          interfaz; la capa Infrastructure la implementa. El handler nunca ve
          Azure.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          Paso 1: Abstracción en la Capa Application
        </h3>

        <CodeBlock language="csharp">
          {
            "// De: Gathering.Application/Abstractions/IImageStorageService.cs\n// DEFINIDA en Application - el módulo de alto nivel ES DUEÑO de la interfaz\npublic interface IImageStorageService\n{\n    Task<Result<string>> UploadImageAsync(\n        Stream imageStream,\n        string fileName,\n        string contentType,\n        string entityType,\n        CancellationToken cancellationToken = default);\n\n    Task<Result> DeleteImageAsync(\n        string imageUrl, \n        CancellationToken cancellationToken = default);\n}"
          }
        </CodeBlock>

        <p className="mt-4">
          Observa dónde vive esta interfaz:{" "}
          <span className="font-mono">Gathering.Application</span>. No en
          Infrastructure. El módulo de alto nivel define lo que necesita. El
          módulo de bajo nivel se adapta para servirlo.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          Paso 2: Implementación en la Capa Infrastructure
        </h3>

        <CodeBlock language="csharp">
          {
            '// De: Gathering.Infrastructure/Storage/AzureBlobStorageService.cs\n// IMPLEMENTA la interfaz definida por la capa Application\ninternal sealed class AzureBlobStorageService(\n    BlobServiceClient blobServiceClient) : IImageStorageService\n{\n    private const string ContainerName = "images";\n\n    public async Task<Result<string>> UploadImageAsync(\n        Stream imageStream, string fileName, string contentType,\n        string entityType, CancellationToken cancellationToken = default)\n    {\n        try\n        {\n            var containerClient = blobServiceClient\n                .GetBlobContainerClient(ContainerName);\n            await containerClient.CreateIfNotExistsAsync(\n                cancellationToken: cancellationToken);\n\n            var extension = Path.GetExtension(fileName).ToLower();\n            var blobName = $"{entityType}/{Guid.NewGuid()}{extension}";\n            var blobClient = containerClient.GetBlobClient(blobName);\n\n            imageStream.Seek(0, SeekOrigin.Begin);\n\n            var uploadOptions = new BlobUploadOptions\n            {\n                HttpHeaders = new BlobHttpHeaders \n                { \n                    ContentType = contentType \n                }\n            };\n\n            await blobClient.UploadAsync(\n                imageStream, uploadOptions, cancellationToken);\n\n            return Result.Success(blobClient.Uri.AbsoluteUri);\n        }\n        catch (Exception ex)\n        {\n            return Result.Failure<string>(\n                ImageStorageError.UploadFailed(ex.Message));\n        }\n    }\n\n    public async Task<Result> DeleteImageAsync(\n        string imageUrl, CancellationToken cancellationToken = default)\n    {\n        try\n        {\n            var uri = new Uri(imageUrl);\n            var blobClient = new BlobClient(uri);\n            await blobClient.DeleteIfExistsAsync(\n                cancellationToken: cancellationToken);\n\n            return Result.Success();\n        }\n        catch (Exception ex)\n        {\n            return Result.Failure(\n                ImageStorageError.DeleteFailed(ex.Message));\n        }\n    }\n}'
          }
        </CodeBlock>

        <p className="mt-4">
          Todo el código específico de Azure está aislado aquí. La clase es{" "}
          <span className="font-mono">internal sealed</span>, nada fuera de
          Infrastructure siquiera sabe que existe. Lo único visible es la
          interfaz IImageStorageService.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          Paso 3: El Handler Depende Solo de Abstracciones
        </h3>

        <CodeBlock language="csharp">
          {
            '// De: Gathering.Application/Communities/Create/CreateCommunityCommandHandler.cs\npublic sealed class CreateCommunityCommandHandler \n    : ICommandHandler<CreateCommunityCommand, Guid>\n{\n    private readonly ICommunityRepository _communityRepository;\n    private readonly IUnitOfWork _unitOfWork;\n    private readonly IValidator<CreateCommunityCommand> _validator;\n    private readonly IImageStorageService _imageStorageService;\n\n    // Cada dependencia es una ABSTRACCIÓN\n    public CreateCommunityCommandHandler(\n        ICommunityRepository communityRepository,    // Abstracción\n        IUnitOfWork unitOfWork,                       // Abstracción\n        IValidator<CreateCommunityCommand> validator,  // Abstracción\n        IImageStorageService imageStorageService)      // Abstracción\n    {\n        _communityRepository = communityRepository;\n        _unitOfWork = unitOfWork;\n        _validator = validator;\n        _imageStorageService = imageStorageService;\n    }\n\n    public async Task<Result<Guid>> HandleAsync(\n        CreateCommunityCommand command, \n        CancellationToken cancellationToken = default)\n    {\n        var validationResult = await _validator\n            .ValidateAsync(command, cancellationToken);\n        if (!validationResult.IsValid)\n        {\n            var errors = string.Join("; ", \n                validationResult.Errors.Select(e => e.ErrorMessage));\n            return Result.Failure<Guid>(\n                Error.Validation("CreateCommunity.ValidationFailed", errors));\n        }\n\n        string? imageUrl = null;\n        if (command.ImageStream is not null \n            && command.ImageFileName is not null \n            && command.ImageContentType is not null)\n        {\n            // Usa la ABSTRACCIÓN - no hay código de Azure aquí\n            var uploadResult = await _imageStorageService.UploadImageAsync(\n                command.ImageStream,\n                command.ImageFileName,\n                command.ImageContentType,\n                "communities",\n                cancellationToken);\n\n            if (uploadResult.IsFailure)\n                return Result.Failure<Guid>(uploadResult.Error);\n\n            imageUrl = uploadResult.Value;\n        }\n\n        var result = Community.Create(\n            command.Name, command.Description, imageUrl);\n        if (result.IsFailure)\n        {\n            if (imageUrl is not null)\n                await _imageStorageService\n                    .DeleteImageAsync(imageUrl, cancellationToken);\n            return Result.Failure<Guid>(result.Error);\n        }\n\n        _communityRepository.Add(result.Value);\n        await _unitOfWork.SaveChangesAsync(cancellationToken);\n\n        return Result.Success(result.Value.Id);\n    }\n}'
          }
        </CodeBlock>

        <div className="rounded-lg border border-emerald-600 bg-emerald-50 p-4 my-4 dark:bg-emerald-950/30">
          <p className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
            DIP en Acción: Mira los Imports:
          </p>
          <ul className="text-sm space-y-2 text-emerald-900 dark:text-emerald-100">
            <li>
              <span className="font-semibold">El handler importa:</span>{" "}
              Gathering.Application.Abstractions, Gathering.Domain.Abstractions,
              Gathering.Domain.Communities, Gathering.SharedKernel
            </li>
            <li>
              <span className="font-semibold">El handler NO importa:</span>{" "}
              Azure.Storage.Blobs, Microsoft.EntityFrameworkCore,
              System.Data.SqlClient, nada de Infrastructure
            </li>
            <li>
              <span className="font-semibold">Resultado:</span> El handler puede
              ser compilado, probado y ejecutado sin ningún ensamblado de
              Infrastructure
            </li>
          </ul>
        </div>
      </div>

      {/* La Raíz de Composición */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          La Raíz de Composición: Conectando Todo
        </h2>

        <p>
          Si los handlers dependen de abstracciones y la infraestructura las
          implementa, ¿dónde ocurre la conexión? En la{" "}
          <span className="font-semibold">raíz de composición</span>, la
          configuración de inicio donde el contenedor de DI mapea interfaces a
          implementaciones.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          Registro de DI de Infrastructure
        </h3>

        <CodeBlock language="csharp">
          {
            '// De: Gathering.Infrastructure/DependencyInjection.cs\npublic static class DependencyInjection\n{\n    public static IServiceCollection AddInfrastructureServices(\n        this IServiceCollection services, IConfiguration configuration)\n    {\n        // Base de datos - mapea IUnitOfWork a ApplicationDbContext\n        services.AddDbContext<ApplicationDbContext>(options =>\n        {\n            options.UseSqlServer(\n                configuration.GetConnectionString("DefaultConnection"),\n                sqlOptions =>\n                {\n                    sqlOptions.EnableRetryOnFailure(\n                        maxRetryCount: 5,\n                        maxRetryDelay: TimeSpan.FromSeconds(30),\n                        errorNumbersToAdd: null);\n                });\n        });\n\n        // Abstracción de tiempo\n        services.AddSingleton<IDateTimeProvider, DateTimeProvider>();\n\n        // Persistencia - mapea abstracciones a implementaciones\n        services.AddScoped<IUnitOfWork>(\n            provider => provider.GetRequiredService<ApplicationDbContext>());\n        services.AddScoped<ICommunityRepository, CommunityRepository>();\n        services.AddScoped<ISessionRepository, SessionRepository>();\n\n        // Almacenamiento - mapea IImageStorageService a implementación de Azure\n        var connectionString = configuration\n            .GetSection("AzureStorage:ConnectionString").Value\n            ?? throw new InvalidOperationException(\n                "AzureStorage:ConnectionString no está configurado.");\n        services.AddSingleton(new BlobServiceClient(connectionString));\n        services.AddScoped<IImageStorageService, AzureBlobStorageService>();\n\n        return services;\n    }\n}'
          }
        </CodeBlock>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          Registro de DI de Application
        </h3>

        <CodeBlock language="csharp">
          {
            "// De: Gathering.Application/DependencyInjection.cs\npublic static class DependencyInjection\n{\n    public static IServiceCollection AddApplicationServices(\n        this IServiceCollection services)\n    {\n        // Mediator - mapea ISender a Sender\n        services.AddScoped<ISender, Sender>();\n\n        // Auto-registrar todos los handlers de comandos y consultas\n        var assemblies = new[] { typeof(DependencyInjection).Assembly };\n        services.RegisterHandlers(assemblies);\n\n        // Auto-registrar todos los validadores de FluentValidation\n        services.AddValidatorsFromAssembly(\n            typeof(DependencyInjection).Assembly);\n\n        return services;\n    }\n}"
          }
        </CodeBlock>

        <div className="rounded-lg border border-blue-600 bg-blue-50 p-4 my-6 dark:bg-blue-950/30">
          <p className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
            El Patrón DIP en Cada Nivel:
          </p>
          <ul className="text-sm text-blue-900 dark:text-blue-100 space-y-2">
            <li>
              <span className="font-semibold">
                ICommunityRepository → CommunityRepository:
              </span>{" "}
              Domain define la interfaz. Infrastructure proporciona la
              implementación EF Core.
            </li>
            <li>
              <span className="font-semibold">
                IUnitOfWork → ApplicationDbContext:
              </span>{" "}
              Domain define el contrato de persistencia. Infrastructure lo mapea
              al DbContext.
            </li>
            <li>
              <span className="font-semibold">
                IImageStorageService → AzureBlobStorageService:
              </span>{" "}
              Application define el contrato de almacenamiento. Infrastructure
              proporciona la implementación de Azure.
            </li>
            <li>
              <span className="font-semibold">
                IDateTimeProvider → DateTimeProvider:
              </span>{" "}
              Incluso el tiempo está abstraído. Las pruebas pueden inyectar un
              proveedor de tiempo fijo para comportamiento determinístico.
            </li>
            <li>
              <span className="font-semibold">ISender → Sender:</span> El patrón
              mediator mismo sigue DIP, los handlers no saben cómo se despachan
              los mensajes.
            </li>
          </ul>
        </div>
      </div>

      {/* Por Qué las Abstracciones Viven en Domain/Application */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Por Qué las Abstracciones Viven en Domain y Application
        </h2>

        <p>
          Un detalle crítico de DIP en Gathering: las interfaces están definidas{" "}
          <span className="font-semibold">donde se necesitan</span>, no donde se
          implementan. Esta es la inversión.
        </p>

        <CodeBlock language="csharp">
          {
            "// ✗ INCORRECTO: Interfaz definida junto a su implementación\n// Archivo: Gathering.Infrastructure/Repositories/ISessionRepository.cs\n// Esto haría que Domain dependa de Infrastructure\n\n// ✓ CORRECTO: Interfaz definida donde se consume\n// Archivo: Gathering.Domain/Sessions/ISessionRepository.cs\n// Infrastructure depende de Domain para implementar esta interfaz\n\n// Las flechas de dependencia:\n// \n// Gathering.Domain (define ISessionRepository, IUnitOfWork)\n//     ↑\n// Gathering.Application (define IImageStorageService, usa interfaces de Domain)\n//     ↑\n// Gathering.Infrastructure (implementa TODAS las interfaces)\n//     ↑\n// Gathering.Api (raíz de composición, conecta interfaces a implementaciones)"
          }
        </CodeBlock>

        <p className="mt-4">
          Esta es la <span className="font-semibold">inversión</span> en
          Inversión de Dependencias. Sin DIP, el flujo natural de dependencias
          sería:
        </p>

        <CodeBlock language="csharp">
          {
            "// Sin DIP (flujo de dependencia tradicional):\n// Domain → Infrastructure (Domain usa SqlConnection directamente)\n// Application → Infrastructure (Handler usa BlobServiceClient directamente)\n// Esto significa que la lógica de negocio DEPENDE DE detalles de infraestructura\n\n// Con DIP (flujo de dependencia invertido):\n// Infrastructure → Domain (Infrastructure implementa IRepository)\n// Infrastructure → Application (Infrastructure implementa IImageStorageService)\n// Esto significa que los detalles de infraestructura DEPENDEN DE abstracciones de negocio"
          }
        </CodeBlock>
      </div>

      {/* Beneficios de Testing */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Testing: Donde DIP Da sus Frutos
        </h2>

        <p>
          El beneficio más tangible de DIP es la testeabilidad. Porque los
          handlers dependen de abstracciones, puedes sustituir cualquier
          implementación, incluyendo dobles de prueba.
        </p>

        <CodeBlock language="csharp">
          {
            '// Prueba unitaria de CreateCommunityCommandHandler\n// NO se necesita cuenta de Azure. NO se necesita base de datos.\n\npublic class CreateCommunityCommandHandlerTests\n{\n    [Test]\n    public async Task Handle_WithValidCommand_CreatesCommunity()\n    {\n        // Arrange - todas las dependencias son dobles de prueba\n        var mockRepository = new MockCommunityRepository();\n        var mockUnitOfWork = new MockUnitOfWork();\n        var mockValidator = new AlwaysValidValidator();\n        var mockImageStorage = new InMemoryImageStorage();\n\n        var handler = new CreateCommunityCommandHandler(\n            mockRepository,\n            mockUnitOfWork,\n            mockValidator,\n            mockImageStorage);\n\n        var command = new CreateCommunityCommand(\n            "Comunidad de Código Limpio",\n            "Una comunidad enfocada en prácticas de código limpio");\n\n        // Act\n        var result = await handler.HandleAsync(\n            command, CancellationToken.None);\n\n        // Assert\n        Assert.That(result.IsSuccess, Is.True);\n        Assert.That(mockRepository.Added.Count, Is.EqualTo(1));\n        Assert.That(\n            mockRepository.Added[0].Name, \n            Is.EqualTo("Comunidad de Código Limpio"));\n        Assert.That(mockUnitOfWork.SavedChanges, Is.True);\n    }\n\n    [Test]\n    public async Task Handle_WithImage_UploadsToStorage()\n    {\n        var mockImageStorage = new InMemoryImageStorage();\n        var handler = new CreateCommunityCommandHandler(\n            new MockCommunityRepository(),\n            new MockUnitOfWork(),\n            new AlwaysValidValidator(),\n            mockImageStorage);\n\n        var imageStream = new MemoryStream(new byte[] { 1, 2, 3 });\n        var command = new CreateCommunityCommand(\n            "Comunidad", "Descripción")\n        {\n            ImageStream = imageStream,\n            ImageFileName = "logo.png",\n            ImageContentType = "image/png"\n        };\n\n        await handler.HandleAsync(command, CancellationToken.None);\n\n        // Verificar que la imagen fue subida a través de la abstracción\n        Assert.That(mockImageStorage.UploadedFiles.Count, Is.EqualTo(1));\n        Assert.That(\n            mockImageStorage.UploadedFiles[0].EntityType, \n            Is.EqualTo("communities"));\n    }\n}\n\n// Doble de prueba - trivial de implementar porque la interfaz es pequeña\npublic class InMemoryImageStorage : IImageStorageService\n{\n    public List<(Stream Stream, string FileName, string EntityType)> \n        UploadedFiles = new();\n\n    public Task<Result<string>> UploadImageAsync(\n        Stream imageStream, string fileName, string contentType,\n        string entityType, CancellationToken ct = default)\n    {\n        UploadedFiles.Add((imageStream, fileName, entityType));\n        return Task.FromResult(\n            Result.Success($"https://test.blob.core/{entityType}/{fileName}"));\n    }\n\n    public Task<Result> DeleteImageAsync(\n        string imageUrl, CancellationToken ct = default)\n    {\n        return Task.FromResult(Result.Success());\n    }\n}'
          }
        </CodeBlock>
      </div>

      {/* Sección TypeScript */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          DIP en TypeScript
        </h2>

        <p>
          TypeScript logra DIP a través de interfaces e inyección por
          constructor. Aquí está el mismo patrón en un contexto Node.js/Express:
        </p>

        <CodeBlock language="typescript">
          {
            '// Abstracciones - definidas por el módulo de alto nivel\ninterface ICommunityRepository {\n  getById(id: string): Promise<Community | null>;\n  getAll(): Promise<ReadonlyArray<Community>>;\n  add(community: Community): void;\n}\n\ninterface IUnitOfWork {\n  saveChanges(): Promise<number>;\n}\n\ninterface IImageStorageService {\n  uploadImage(\n    stream: NodeJS.ReadableStream,\n    fileName: string,\n    contentType: string,\n    entityType: string\n  ): Promise<Result<string>>;\n\n  deleteImage(imageUrl: string): Promise<Result<void>>;\n}\n\n// Módulo de alto nivel - depende SOLO de abstracciones\nclass CreateCommunityHandler {\n  constructor(\n    private repository: ICommunityRepository,\n    private unitOfWork: IUnitOfWork,\n    private imageStorage: IImageStorageService\n  ) {}\n\n  async handle(command: CreateCommunityCommand): Promise<Result<string>> {\n    const result = Community.create(command.name, command.description);\n    if (!result.isSuccess) return failure(result.error);\n\n    if (command.imageStream) {\n      const uploadResult = await this.imageStorage.uploadImage(\n        command.imageStream,\n        command.imageFileName,\n        command.imageContentType,\n        "communities"\n      );\n\n      if (!uploadResult.isSuccess) {\n        return failure(uploadResult.error);\n      }\n    }\n\n    this.repository.add(result.value);\n    await this.unitOfWork.saveChanges();\n    return success(result.value.id);\n  }\n}\n\n// Módulo de bajo nivel - implementación de Azure\nclass AzureBlobImageStorage implements IImageStorageService {\n  constructor(private blobServiceClient: BlobServiceClient) {}\n\n  async uploadImage(\n    stream: NodeJS.ReadableStream,\n    fileName: string,\n    contentType: string,\n    entityType: string\n  ): Promise<Result<string>> {\n    const containerClient = this.blobServiceClient\n      .getContainerClient("images");\n    const ext = fileName.slice(fileName.lastIndexOf("."));\n    const blobName = entityType + "/" + crypto.randomUUID() + ext;\n    const blobClient = containerClient.getBlockBlobClient(blobName);\n\n    await blobClient.uploadStream(stream);\n    return success(blobClient.url);\n  }\n\n  async deleteImage(imageUrl: string): Promise<Result<void>> {\n    const blobClient = new BlobClient(imageUrl);\n    await blobClient.delete();\n    return success(undefined);\n  }\n}\n\n// Raíz de composición (ej. en el arranque de la app)\nfunction configureServices(): CreateCommunityHandler {\n  const blobClient = new BlobServiceClient(connectionString);\n  const dbContext = new PrismaClient();\n\n  const repository = new PrismaCommunityRepository(dbContext);\n  const unitOfWork = new PrismaUnitOfWork(dbContext);\n  const imageStorage = new AzureBlobImageStorage(blobClient);\n\n  return new CreateCommunityHandler(repository, unitOfWork, imageStorage);\n}\n\n// Configuración de prueba - intercambia implementaciones sin cambiar el handler\nfunction createTestHandler(): CreateCommunityHandler {\n  return new CreateCommunityHandler(\n    new InMemoryCommunityRepository(),\n    new InMemoryUnitOfWork(),\n    new InMemoryImageStorage()\n  );\n}'
          }
        </CodeBlock>
      </div>

      {/* Beneficios */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Beneficios de Aplicar DIP
        </h2>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          1. Pruebas Unitarias Reales
        </h3>
        <p>
          Cada handler puede ser probado en completo aislamiento. Sin base de
          datos, sin servicios en la nube, sin llamadas de red. Las pruebas son
          rápidas, determinísticas y confiables.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          2. Intercambiabilidad de Infraestructura
        </h3>
        <p>
          Gathering usa Azure Blob Storage hoy. Cambiar a AWS S3 significa crear
          una sola clase nueva: AwsS3StorageService. El handler, el dominio, los
          validadores, ninguno de ellos cambia.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          3. Desarrollo en Paralelo
        </h3>
        <p>
          Un equipo puede construir la capa Application mientras otro construye
          la capa Infrastructure. Acuerdan las interfaces (IRepository,
          IImageStorageService) y trabajan independientemente. La raíz de
          composición los conecta en tiempo de despliegue.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          4. Dependencias de Compilación Limpias
        </h3>
        <p>
          El proyecto Application no referencia EF Core, Azure SDK ni ningún
          paquete NuGet de infraestructura. Esto significa que los cambios en
          Infrastructure nunca fuerzan la recompilación de Application. Los
          tiempos de compilación se mantienen rápidos.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          5. Límites Arquitectónicos Claros
        </h3>
        <p>
          DIP impone la &ldquo;arquitectura cebolla&rdquo;: el núcleo (Domain,
          Application) no tiene conocimiento de las capas externas
          (Infrastructure, API). Esto hace que la base de código sea navegable y
          mantenible a medida que crece.
        </p>
      </div>

      {/* Trampas */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Trampas del Mundo Real
        </h2>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          Trampa 1: Abstraer Todo
        </h3>
        <p>
          No toda clase necesita una interfaz. Las clases utilitarias, los
          objetos de valor y las entidades de dominio no necesitan
          abstracciones. Aplica DIP en{" "}
          <span className="font-semibold">límites arquitectónicos</span>
          (donde los módulos cruzan capas (Application → Infrastructure, Domain
          → Persistencia).
        </p>
        <p className="text-sm italic mt-2">
          Guía: Abstrae lo volátil (almacenamiento, APIs externas, tiempo,
          email). No abstraigas lo estable (manipulación de strings,
          matemáticas, objetos de valor del dominio).
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          Trampa 2: Interfaz en la Capa Equivocada
        </h3>
        <p>
          Si IImageStorageService estuviera definida en
          Gathering.Infrastructure, la capa Application necesitaría referenciar
          Infrastructure, derrotando el propósito. Siempre define las
          abstracciones en la capa que las{" "}
          <span className="font-semibold">consume</span>.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          Trampa 3: Contenedor de DI como Service Locator
        </h3>
        <p>
          Evita inyectar <span className="font-mono">IServiceProvider</span> y
          resolver servicios manualmente. Esto oculta dependencias y hace el
          código más difícil de entender y probar. Usa inyección explícita por
          constructor.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          Trampa 4: Abstracciones con Fugas
        </h3>
        <p>
          Si tu interfaz expone tipos específicos de Azure (como BlobProperties
          o S3Response), derrota el propósito de DIP. La interfaz debe usar
          tipos a nivel de dominio: streams, strings, objetos Result, nunca
          tipos de infraestructura.
        </p>
      </div>

      {/* Lista de Verificación */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Lista de Verificación: Detectando Violaciones de DIP
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
              ¿Tus handlers o servicios referencian directamente paquetes de
              infraestructura (Azure SDK, EF Core, clientes HTTP)?
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
              ¿Tus constructores crean sus propias dependencias usando{" "}
              <span className="font-mono">new</span>?
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
              ¿Puedes probar tu lógica de negocio sin una base de datos,
              servicio en la nube o conexión de red?
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
              ¿Están tus interfaces definidas en la misma capa que sus
              implementaciones en lugar de donde se consumen?
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
              ¿Cambiar un detalle de infraestructura (cambiar bases de datos,
              actualizar un SDK) fuerza cambios en tu lógica de negocio?
            </label>
          </div>
        </div>

        <p>
          Si respondes &ldquo;sí&rdquo; a cualquiera de estas, probablemente se
          esté violando DIP.
        </p>
      </div>

      {/* Conclusión */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Conclusión</h2>

        <p>
          El Principio de Inversión de Dependencias es lo que hace que todos los
          demás principios SOLID funcionen a nivel arquitectónico. Al asegurar
          que la lógica de negocio de alto nivel depende de abstracciones, no de
          infraestructura concreta, creas sistemas que son testeables, flexibles
          y resilientes al cambio.
        </p>

        <p>
          Gathering demuestra esto a través de su arquitectura por capas: el
          Domain define interfaces de repositorio, Application define
          abstracciones de servicio, e Infrastructure las implementa todas. La
          raíz de composición en la capa API conecta todo al inicio. Ningún
          handler ve jamás una conexión a base de datos o un SDK de nube.
        </p>

        <p>
          La idea clave:{" "}
          <span className="font-semibold">
            la dirección de las dependencias del código fuente debe ser opuesta
            al flujo de control
          </span>
          . Tu lógica de negocio llama a métodos de almacenamiento en tiempo de
          ejecución, pero la dependencia del código fuente apunta desde la
          implementación de almacenamiento hacia la abstracción de negocio, no
          al revés.
        </p>

        <p>
          Esto concluye nuestra serie sobre principios SOLID. Juntos, SRP, OCP,
          LSP, ISP y DIP forman una filosofía de diseño cohesiva: construye
          clases pequeñas y enfocadas (SRP) que estén abiertas para extensión
          (OCP), sean sustituibles de forma segura (LSP), con interfaces
          enfocadas (ISP) y conectadas a través de abstracciones (DIP). Dominar
          estos principios es la base para escribir software profesional y
          mantenible.
        </p>
      </div>
    </>
  );
}
