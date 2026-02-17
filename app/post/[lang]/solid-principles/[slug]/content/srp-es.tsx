import { CodeBlock } from "@/components/code-block";

export function SrpContentEs() {
  return (
    <>
      {/* Introducción */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Introducción</h2>
        <p>
          El Principio de Responsabilidad Única (SRP) establece:{" "}
          <span className="font-semibold">
            una clase debe tener una, y solo una, razón para cambiar
          </span>
          . En otras palabras, cada módulo o clase debe ser responsable de una
          sola parte de la funcionalidad proporcionada por el software, y esa
          responsabilidad debe estar completamente encapsulada por la clase.
        </p>
        <p>
          SRP es el primero de los principios SOLID y a menudo el más mal
          entendido. No significa que una clase deba tener un solo método.
          Significa que todos los métodos y propiedades de la clase deben estar
          alineados con un solo propósito o preocupación. Cuando una clase hace
          demasiado, se convierte en un imán para los cambios, cada nuevo
          requerimiento toca la misma clase, incrementando el riesgo de bugs.
        </p>
        <p>
          En este artículo, exploramos SRP a través de un escenario del mundo
          real: construir un sistema de gestión de Comunidades de Práctica.
          Verás cómo la arquitectura de Gathering divide las responsabilidades
          de forma limpia, y qué sucede cuando las mezclas.
        </p>
      </div>

      {/* El Problema */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          El Problema: Clases Que Hacen Demasiado
        </h2>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          Un Ejemplo Simple: Servicio de Reportes
        </h3>

        <p>
          Antes de sumergirnos en el código de Gathering, veamos una violación
          simple de SRP: un servicio de reportes que maneja generación de datos,
          formateo y envío de correos en una sola clase.
        </p>

        <h4 className="text-base font-semibold text-foreground mt-4">
          Sin SRP: Una Clase con Múltiples Responsabilidades
        </h4>

        <CodeBlock language="csharp">
          {
            'public class ReportService\n{\n    // Responsabilidad 1: Obtener datos\n    public DataTable GetSalesData(DateTime from, DateTime to)\n    {\n        using var connection = new SqlConnection("...");\n        var query = "SELECT * FROM Sales WHERE Date BETWEEN @from AND @to";\n        // ...\n    }\n\n    // Responsabilidad 2: Formatear el reporte\n    public string FormatAsHtml(DataTable data)\n    {\n        var html = "<html><body><table>";\n        foreach (DataRow row in data.Rows)\n        {\n            html += "<tr>";\n            foreach (var item in row.ItemArray)\n                html += $"<td>{item}</td>";\n            html += "</tr>";\n        }\n        return html + "</table></body></html>";\n    }\n\n    // Responsabilidad 3: Enviar por correo\n    public void SendReport(string htmlContent, string recipient)\n    {\n        var smtpClient = new SmtpClient("smtp.company.com");\n        var message = new MailMessage("reports@company.com", recipient)\n        {\n            Body = htmlContent,\n            IsBodyHtml = true\n        };\n        smtpClient.Send(message);\n    }\n\n    // Responsabilidad 4: Orquestar todo\n    public void GenerateAndSendReport(\n        DateTime from, DateTime to, string recipient)\n    {\n        var data = GetSalesData(from, to);\n        var html = FormatAsHtml(data);\n        SendReport(html, recipient);\n    }\n}'
          }
        </CodeBlock>

        <div className="rounded-lg border border-red-600 bg-red-50 p-4 my-4 dark:bg-red-950/30">
          <p className="font-semibold text-red-900 dark:text-red-100 mb-3">
            Problemas con esta Clase:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-red-900 dark:text-red-100">
            <li>
              <span className="font-semibold">Acceso a datos:</span> Cambiar de
              SQL Server a PostgreSQL requiere modificar ReportService.
            </li>
            <li>
              <span className="font-semibold">Formato:</span> Agregar formato
              PDF requiere modificar ReportService.
            </li>
            <li>
              <span className="font-semibold">Envío:</span> Cambiar de SMTP a
              SendGrid requiere modificar ReportService.
            </li>
            <li>
              <span className="font-semibold">Testing:</span> No se puede probar
              el formato sin una base de datos real.
            </li>
          </ul>
        </div>

        <h4 className="text-base font-semibold text-foreground mt-4">
          Con SRP: Responsabilidades Separadas
        </h4>

        <CodeBlock language="csharp">{`// Cada clase tiene UNA razón para cambiar

public interface ISalesDataProvider
{
    DataTable GetSalesData(DateTime from, DateTime to);
}

public interface IReportFormatter
{
    string Format(DataTable data);
}

public interface IReportSender
{
    void Send(string content, string recipient);
}

// La clase de orquestación solo coordina
public class ReportService
{
    private readonly ISalesDataProvider _dataProvider;
    private readonly IReportFormatter _formatter;
    private readonly IReportSender _sender;

    public ReportService(
        ISalesDataProvider dataProvider,
        IReportFormatter formatter,
        IReportSender sender)
    {
        _dataProvider = dataProvider;
        _formatter = formatter;
        _sender = sender;
    }

    public void GenerateAndSendReport(
        DateTime from, DateTime to, string recipient)
    {
        var data = _dataProvider.GetSalesData(from, to);
        var content = _formatter.Format(data);
        _sender.Send(content, recipient);
    }
}`}</CodeBlock>

        <div className="rounded-lg border border-green-600 bg-green-50 p-4 my-6 dark:bg-green-950/30">
          <p className="font-semibold text-green-900 dark:text-green-100 mb-3">
            Beneficios de SRP Aquí:
          </p>
          <ul className="text-sm text-green-900 dark:text-green-100 space-y-2">
            <li>
              <span className="font-semibold">✓ Testeable:</span> Cada
              componente se puede probar de forma aislada con mocks.
            </li>
            <li>
              <span className="font-semibold">✓ Intercambiable:</span> Cambiar
              el formato de HTML a PDF solo requiere una nueva implementación de
              IReportFormatter.
            </li>
            <li>
              <span className="font-semibold">✓ Enfocado:</span> Cada clase
              tiene una sola razón para cambiar.
            </li>
          </ul>
        </div>
      </div>

      {/* Caso de Estudio: Gathering */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Caso de Estudio: Separación de Responsabilidades en Gathering
        </h2>

        <p>
          Gathering, nuestro sistema de gestión de Comunidades de Práctica,
          demuestra SRP en cada capa de la arquitectura. Cada clase tiene un
          propósito claro y una sola razón para cambiar.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          La Entidad de Dominio: Session
        </h3>

        <p>
          La clase Session es responsable exclusivamente de la lógica de negocio
          de una sesión: sus reglas de validación, transiciones de estado y
          eventos de dominio.
        </p>

        <CodeBlock language="csharp">{`// De: Gathering.Domain/Sessions/Session.cs
// Responsabilidad ÚNICA: lógica de negocio de una sesión
public sealed partial class Session : AuditableEntity
{
    public Guid Id { get; private set; }
    public Guid CommunityId { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string Speaker { get; private set; } = string.Empty;
    public DateTimeOffset ScheduledAt { get; private set; }
    public SessionStatus Status { get; private set; }

    public static Result<Session> Create(
        Guid communityId, string title, string speaker,
        DateTimeOffset scheduledAt, string? description = null,
        string? image = null)
    {
        if (string.IsNullOrWhiteSpace(title))
            return Result.Failure<Session>(SessionError.TitleRequired);

        if (scheduledAt <= DateTimeOffset.UtcNow)
            return Result.Failure<Session>(SessionError.ScheduledInPast);

        var session = new Session
        {
            Id = Guid.NewGuid(),
            CommunityId = communityId,
            Title = title,
            Speaker = speaker,
            ScheduledAt = scheduledAt,
            Status = SessionStatus.Scheduled
        };

        session.Raise(new SessionCreatedDomainEvent(session.Id));
        return Result.Success(session);
    }

    public Result UpdateStatus(SessionStatus newStatus)
    {
        if (Status == SessionStatus.Canceled && 
            newStatus == SessionStatus.Scheduled)
            return Result.Failure(SessionError.InvalidStatusTransition);

        if (Status == SessionStatus.Completed && 
            newStatus == SessionStatus.Scheduled)
            return Result.Failure(SessionError.InvalidStatusTransition);

        Status = newStatus;
        return Result.Success();
    }
}`}</CodeBlock>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          El Command Handler: Una Sola Operación
        </h3>

        <CodeBlock language="csharp">{`// De: Gathering.Application/Sessions/Create/CreateSessionCommandHandler.cs
// Responsabilidad ÚNICA: orquestar la creación de una sesión
public sealed class CreateSessionCommandHandler 
    : ICommandHandler<CreateSessionCommand, Guid>
{
    private readonly ISessionRepository _sessionRepository;
    private readonly ICommunityRepository _communityRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IValidator<CreateSessionCommand> _validator;
    private readonly IImageStorageService _imageStorageService;

    // Cada dependencia tiene su propia responsabilidad
    public CreateSessionCommandHandler(
        ISessionRepository sessionRepository,
        ICommunityRepository communityRepository,
        IUnitOfWork unitOfWork,
        IValidator<CreateSessionCommand> validator,
        IImageStorageService imageStorageService)
    {
        _sessionRepository = sessionRepository;
        _communityRepository = communityRepository;
        _unitOfWork = unitOfWork;
        _validator = validator;
        _imageStorageService = imageStorageService;
    }

    public async Task<Result<Guid>> HandleAsync(
        CreateSessionCommand command, CancellationToken ct = default)
    {
        // Paso 1: Validar el comando
        var validationResult = await _validator.ValidateAsync(command, ct);
        if (!validationResult.IsValid)
            return Result.Failure<Guid>(/* error de validación */);

        // Paso 2: Verificar que la comunidad existe
        var community = await _communityRepository
            .GetByIdAsync(command.CommunityId, ct);
        if (community is null)
            return Result.Failure<Guid>(CommunityError.NotFound);

        // Paso 3: Crear la sesión (delega al dominio)
        var result = Session.Create(
            command.CommunityId, command.Title, 
            command.Speaker, command.ScheduledAt);
        if (result.IsFailure)
            return Result.Failure<Guid>(result.Error);

        // Paso 4: Persistir
        _sessionRepository.Add(result.Value);
        await _unitOfWork.SaveChangesAsync(ct);

        return Result.Success(result.Value.Id);
    }
}`}</CodeBlock>

        <div className="rounded-lg border border-blue-600 bg-blue-50 p-4 my-6 dark:bg-blue-950/30">
          <p className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
            SRP en Cada Capa:
          </p>
          <ul className="text-sm text-blue-900 dark:text-blue-100 space-y-2">
            <li>
              <span className="font-semibold">Session (Dominio):</span> Solo
              lógica de negocio (validación, estado, eventos). No sabe nada de
              bases de datos ni HTTP.
            </li>
            <li>
              <span className="font-semibold">
                CreateSessionCommandHandler (Aplicación):
              </span>{" "}
              Solo orquestación (valida, verifica, delega al dominio, persiste).
              No contiene lógica de negocio.
            </li>
            <li>
              <span className="font-semibold">
                SessionRepository (Infraestructura):
              </span>{" "}
              Solo acceso a datos (EF Core queries). No tiene lógica de negocio
              ni de aplicación.
            </li>
            <li>
              <span className="font-semibold">
                IImageStorageService (Abstracción):
              </span>{" "}
              Solo almacenamiento de imágenes. No le importa quién la usa ni por
              qué.
            </li>
          </ul>
        </div>
      </div>

      {/* Versión TypeScript */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          SRP en TypeScript
        </h2>

        <p>
          Los mismos principios aplican en TypeScript. Aquí está el patrón de
          separación de responsabilidades en un contexto Node.js/Express:
        </p>

        <CodeBlock language="typescript">
          {`// ✗ VIOLACIÓN: Una clase que hace todo
class SessionManager {
  async createSession(data: CreateSessionDto) {
    // Validación (responsabilidad 1)
    if (!data.title) throw new Error("Title required");
    if (data.scheduledAt <= new Date()) throw new Error("Must be future");

    // Acceso a datos (responsabilidad 2)  
    const community = await prisma.community.findUnique({
      where: { id: data.communityId }
    });
    if (!community) throw new Error("Community not found");

    // Lógica de negocio (responsabilidad 3)
    const session = await prisma.session.create({
      data: { ...data, status: "scheduled" }
    });

    // Notificación (responsabilidad 4)
    await sendEmail(community.adminEmail, "New session created");
    
    return session;
  }
}

// ✓ CORRECTO: Responsabilidades separadas
interface SessionRepository {
  create(session: Session): Promise<Session>;
  findById(id: string): Promise<Session | null>;
}

interface CommunityRepository {
  findById(id: string): Promise<Community | null>;
}

interface NotificationService {
  notifySessionCreated(session: Session): Promise<void>;
}

class CreateSessionHandler {
  constructor(
    private sessions: SessionRepository,
    private communities: CommunityRepository,
    private notifications: NotificationService
  ) {}

  async handle(command: CreateSessionCommand): Promise<Result<Session>> {
    const community = await this.communities.findById(command.communityId);
    if (!community) return failure("Community not found");

    const session = Session.create(
      command.communityId,
      command.title,
      command.speaker,
      command.scheduledAt
    );

    if (!session.isSuccess) return failure(session.error);

    await this.sessions.create(session.value);
    await this.notifications.notifySessionCreated(session.value);

    return success(session.value);
  }
}`}
        </CodeBlock>
      </div>

      {/* Beneficios */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Beneficios de Aplicar SRP
        </h2>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          1. Testing Simplificado
        </h3>
        <p>
          Cada clase se puede probar de forma aislada. Pruebas de Session
          verifican lógica de negocio sin base de datos. Pruebas del handler
          usan mocks para las dependencias.
        </p>
        <CodeBlock language="csharp">
          {`
          // Tests para CreateSessionCommandValidator - Sin mocks, sin base de datos
          [TestFixture]
          public class CreateSessionCommandValidatorTests
          {
              private CreateSessionCommandValidator _validator = null!;

              [SetUp]
              public void Setup() => _validator = new CreateSessionCommandValidator();

              [Test]
              public void Validate_WithEmptyTitle_ReturnsError()
              {
                  var command = new CreateSessionCommand 
                  { 
                      Title = "", 
                      ScheduledDate = DateTime.UtcNow.AddDays(7),
                      Speaker = "John Doe"
                  };

                  var result = _validator.Validate(command);

                  Assert.That(result.IsValid, Is.False);
                  Assert.That(result.Errors, Contains.Item("Title is required"));
              }

              [Test]
              public void Validate_WithPastDate_ReturnsError()
              {
                  var command = new CreateSessionCommand 
                  { 
                      Title = "SOLID Principles Workshop",
                      ScheduledDate = DateTime.UtcNow.AddDays(-1),
                      Speaker = "Jane Smith"
                  };

                  var result = _validator.Validate(command);

                  Assert.That(result.IsValid, Is.False);
                  Assert.That(result.Errors, Contains.Item("Session cannot be in the past"));
              }

              [Test]
              public void Validate_WithValidData_ReturnsSuccess()
              {
                  var command = new CreateSessionCommand 
                  { 
                      Title = "SOLID Principles Workshop",
                      ScheduledDate = DateTime.UtcNow.AddDays(7),
                      Speaker = "Jane Smith"
                  };

                  var result = _validator.Validate(command);

                  Assert.That(result.IsValid, Is.True);
                  Assert.That(result.Errors, Is.Empty);
              }
          }

          // Tests para Session.Create() - Pruebas de lógica de dominio pura
          [TestFixture]
          public class SessionDomainTests
          {
              [Test]
              public void Create_WithValidData_ReturnsSuccess()
              {
                  var result = Session.Create(
                      communityId: Guid.NewGuid(),
                      title: "Clean Code Practices",
                      speaker: "Robert Martin",
                      scheduledAt: DateTimeOffset.UtcNow.AddDays(7)
                  );

                  Assert.That(result.IsSuccess, Is.True);
                  Assert.That(result.Value.Title, Is.EqualTo("Clean Code Practices"));
                  Assert.That(result.Value.Status, Is.EqualTo(SessionStatus.Scheduled));
              }

              [Test]
              public void Create_WithPastDate_ReturnsFailure()
              {
                  var result = Session.Create(
                      communityId: Guid.NewGuid(),
                      title: "SOLID Workshop",
                      speaker: "SOLID Expert",
                      scheduledAt: DateTimeOffset.UtcNow.AddDays(-1)
                  );

                  Assert.That(result.IsFailure, Is.True);
                  Assert.That(result.Error, Is.EqualTo(SessionError.ScheduledInPast));
              }
          }

          // Tests para CreateSessionCommandHandler - Usa mocks controlados
          [TestFixture]
          public class CreateSessionCommandHandlerTests
          {
              private CreateSessionCommandHandler _handler = null!;
              private Mock<ISessionRepository> _sessionRepositoryMock = null!;
              private Mock<ICommunityRepository> _communityRepositoryMock = null!;
              private Mock<IUnitOfWork> _unitOfWorkMock = null!;
              private Mock<IValidator<CreateSessionCommand>> _validatorMock = null!;

              [SetUp]
              public void Setup()
              {
                  _sessionRepositoryMock = new Mock<ISessionRepository>();
                  _communityRepositoryMock = new Mock<ICommunityRepository>();
                  _unitOfWorkMock = new Mock<IUnitOfWork>();
                  _validatorMock = new Mock<IValidator<CreateSessionCommand>>();

                  _handler = new CreateSessionCommandHandler(
                      _sessionRepositoryMock.Object,
                      _communityRepositoryMock.Object,
                      _unitOfWorkMock.Object,
                      _validatorMock.Object,
                      new NoOpImageStorageService() // Mock simple
                  );
              }

              [Test]
              public async Task HandleAsync_WithValidCommand_CreatesSession()
              {
                  var communityId = Guid.NewGuid();
                  var command = new CreateSessionCommand 
                  { 
                      CommunityId = communityId,
                      Title = "Design Patterns",
                      Speaker = "Gang of Four",
                      ScheduledDate = DateTime.UtcNow.AddDays(7)
                  };

                  var community = new Community { Id = communityId, Name = "Architects" };
                  
                  _validatorMock
                      .Setup(v => v.ValidateAsync(command, It.IsAny<CancellationToken>()))
                      .ReturnsAsync(new ValidationResult());
                  
                  _communityRepositoryMock
                      .Setup(r => r.GetByIdAsync(communityId, It.IsAny<CancellationToken>()))
                      .ReturnsAsync(community);

                  var result = await _handler.HandleAsync(command);

                  Assert.That(result.IsSuccess, Is.True);
                  _sessionRepositoryMock.Verify(r => r.Add(It.IsAny<Session>()), Times.Once);
                  _unitOfWorkMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
              }
          }
        `}
        </CodeBlock>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          2. Cambios Localizados
        </h3>
        <p>
          Cambiar el proveedor de almacenamiento de imágenes solo afecta
          AzureBlobStorageService. El handler, la validación y el dominio no
          cambian.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          3. Legibilidad
        </h3>
        <p>
          Cada archivo tiene un propósito claro. Puedes entender qué hace una
          clase con solo leer su nombre y su constructor.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          4. Desarrollo en Paralelo
        </h3>
        <p>
          Un desarrollador puede trabajar en el repositorio mientras otro
          trabaja en la validación. No hay conflictos porque las
          responsabilidades están separadas.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          5. Reutilización
        </h3>
        <p>
          IImageStorageService puede ser usado por cualquier handler que
          necesite almacenar imágenes. No está atada a una operación específica.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-foreground">Errores Comunes</h2>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          Error 1: Llevar SRP al Extremo
        </h3>
        <p>
          SRP no significa una clase por método. Significa una responsabilidad
          cohesiva por clase. Session tiene múltiples métodos (Create,
          UpdateStatus, Update) pero todos sirven a la misma responsabilidad:
          gestionar la lógica de negocio de una sesión.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          Error 2: Confundir Capas con Responsabilidades
        </h3>
        <p>
          Tener un &ldquo;ServiceLayer&rdquo; no significa que todas las clases
          ahí dentro tengan una sola responsabilidad. Un CommunityService que
          maneja creación, actualización, eliminación y consultas tiene al menos
          cuatro razones para cambiar.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          Error 3: Ignorar la Cohesión
        </h3>
        <p>
          Si separas demasiado, terminas con clases que no tienen sentido por sí
          solas. La clave es agrupar cosas que cambian juntas y separar las que
          cambian por razones diferentes.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Checklist: Detectando Violaciones de SRP
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
            <label>¿Tu clase tiene más de una razón para cambiar?</label>
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
              ¿El nombre de la clase necesita las palabras &ldquo;y&rdquo; o
              &ldquo;o&rdquo; para describir lo que hace?
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
              ¿Necesitas importar paquetes de infraestructura (SMTP, SQL, Azure
              SDK) en tu lógica de negocio?
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
            <label>¿Tu test necesita mockear más de 3-4 dependencias?</label>
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
              ¿Un cambio en los requerimientos de UI obliga a cambiar la lógica
              de persistencia?
            </label>
          </div>
        </div>

        <p>
          Si respondes &ldquo;sí&rdquo; a alguna de estas preguntas, SRP
          probablemente está siendo violado.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-foreground">Conclusión</h2>

        <p>
          El Principio de Responsabilidad Única es la base de todos los
          principios SOLID. Al asegurar que cada clase tiene una sola razón para
          cambiar, creas un código que es más fácil de entender, probar y
          mantener.
        </p>

        <p>
          Gathering demuestra esto a través de su arquitectura por capas: el
          Dominio maneja las reglas de negocio, la Aplicación orquesta
          operaciones, y la Infraestructura implementa los detalles técnicos.
          Cada clase tiene un propósito claro y bien definido.
        </p>

        <p>
          La clave:{" "}
          <span className="font-semibold">
            pregúntate &ldquo;¿cuáles son las razones por las que esta clase
            podría cambiar?&rdquo;
          </span>{" "}
          Si encuentras más de una, es momento de separar responsabilidades.
        </p>

        <p>
          En el siguiente artículo, exploramos el Principio Abierto/Cerrado, que
          asegura que puedas extender el comportamiento de un sistema sin
          modificar el código existente.
        </p>
      </div>
    </>
  );
}
