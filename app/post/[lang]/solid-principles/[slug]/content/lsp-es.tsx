import { CodeBlock } from "@/components/code-block";

export function LspContentEs() {
  return (
    <>
      {/* Introducción */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Introducción</h2>
        <p>
          El Principio de Sustitución de Liskov (LSP) establece:{" "}
          <span className="font-semibold">
            los subtipos deben ser sustituibles por sus tipos base sin alterar
            la correctitud del programa
          </span>
          . En términos más simples, si tu código funciona con una clase base,
          debería funcionar de manera idéntica cuando sustituyes cualquier
          subclase, sin sorpresas, sin contratos rotos.
        </p>
        <p>
          LSP a menudo se malinterpreta como &ldquo;las subclases deben heredar
          correctamente.&rdquo; Pero va más profundo: define un contrato de
          comportamiento. Una subclase que lanza excepciones inesperadas, ignora
          precondiciones o cambia el significado de un método viola LSP, incluso
          si compila perfectamente.
        </p>
        <p>
          Este principio importa porque OCP depende de él. Si diseñas un sistema
          para extensión (OCP), las nuevas implementaciones deben comportarse
          consistentemente con las expectativas establecidas por el tipo base.
          De lo contrario, el polimorfismo se convierte en una trampa: código
          que funciona con el tipo base se rompe silenciosamente cuando recibe
          un subtipo.
        </p>
        <p>
          En este artículo, exploramos LSP a través de un escenario del mundo
          real: construir un sistema de gestión de Comunidades de Práctica.
          Verás cómo la jerarquía de entidades y el diseño de máquina de estados
          de Gathering respetan LSP, y qué sucede cuando una subclase ingenua lo
          viola.
        </p>
      </div>

      {/* El Problema */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          El Problema: Subtipos que Rompen Expectativas
        </h2>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          Un Ejemplo Simple: Figuras y Cálculo de Área
        </h3>

        <p>
          Antes de sumergirnos en el código de Gathering, veamos la violación
          clásica de LSP: el problema Rectángulo/Cuadrado. Esto ilustra el
          principio fundamental sin necesitar contexto de aplicación.
        </p>

        <h4 className="text-base font-semibold text-foreground mt-4">
          Sin LSP: Un Cuadrado que Rompe el Contrato del Rectángulo
        </h4>

        <CodeBlock language="csharp">{`public class Rectangle
{
    public virtual int Width { get; set; }
    public virtual int Height { get; set; }

    public int CalculateArea()
    {
        return Width * Height;
    }
}

public class Square : Rectangle
{
    // Un cuadrado fuerza Width y Height a ser iguales
    public override int Width
    {
        get => base.Width;
        set
        {
            base.Width = value;
            base.Height = value; // ¡Sorpresa! Establecer Width también cambia Height
        }
    }

    public override int Height
    {
        get => base.Height;
        set
        {
            base.Height = value;
            base.Width = value; // ¡Sorpresa! Establecer Height también cambia Width
        }
    }
}

// Código cliente que trabaja con Rectangle
public void ResizeAndCheck(Rectangle rect)
{
    rect.Width = 5;
    rect.Height = 10;

    // Expectativa: El área debería ser 50
    Console.WriteLine(rect.CalculateArea());
    // Con Rectangle: 50 ✓
    // Con Square:    100 ✗  (¡Width fue sobreescrito a 10!)
}`}</CodeBlock>

        <p className="mt-4">
          <span className="font-semibold">El problema:</span> Square
          sobreescribe el comportamiento del setter, violando el contrato de que
          Width y Height son independientes. Cualquier código que los establezca
          por separado producirá resultados incorrectos cuando reciba un Square.
          El subtipo{" "}
          <span className="font-semibold">
            no es sustituible de forma segura
          </span>
          .
        </p>

        <h4 className="text-base font-semibold text-foreground mt-4">
          Con LSP: Tipos Separados con una Interfaz Compartida
        </h4>

        <CodeBlock language="csharp">{`public interface IShape
{
    int CalculateArea();
}

public class Rectangle : IShape
{
    public int Width { get; }
    public int Height { get; }

    public Rectangle(int width, int height)
    {
        Width = width;
        Height = height;
    }

    public int CalculateArea() => Width * Height;
}

public class Square : IShape
{
    public int Side { get; }

    public Square(int side)
    {
        Side = side;
    }

    public int CalculateArea() => Side * Side;
}

// El código cliente trabaja con IShape - sin suposiciones rotas
public void PrintArea(IShape shape)
{
    Console.WriteLine(shape.CalculateArea()); // Siempre correcto
}`}</CodeBlock>

        <div className="rounded-lg border border-green-600 bg-green-50 p-4 my-6 dark:bg-green-950/30">
          <p className="font-semibold text-green-900 dark:text-green-100 mb-3">
            Beneficios de LSP Aquí:
          </p>
          <ul className="text-sm text-green-900 dark:text-green-100 space-y-2">
            <li>
              <span className="font-semibold">
                ✓ Sin efectos secundarios ocultos:
              </span>{" "}
              Cada figura calcula el área correctamente sin acoplamiento
              inesperado de propiedades.
            </li>
            <li>
              <span className="font-semibold">✓ Sustitución segura:</span>{" "}
              Cualquier IShape puede usarse en cualquier lugar sin romper el
              código cliente.
            </li>
            <li>
              <span className="font-semibold">✓ Contratos claros:</span> Cada
              tipo tiene sus propias propiedades apropiadas (Width/Height vs
              Side).
            </li>
          </ul>
        </div>

        <p className="mt-6">
          Este patrón simple, evitar herencia que cambia el significado del tipo
          base, es la base de LSP. Ahora apliquémoslo a un sistema más grande
          del mundo real.
        </p>
      </div>

      {/* Caso de Estudio: Jerarquía de Entidades */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Caso de Estudio: Jerarquía de Entidades en Gathering
        </h2>

        <p>
          La aplicación Gathering (un sistema de gestión de Comunidades de
          Práctica) usa una jerarquía de entidades en capas:{" "}
          <span className="font-mono">Entity</span> →{" "}
          <span className="font-mono">AuditableEntity</span> →{" "}
          <span className="font-mono">Session</span> /{" "}
          <span className="font-mono">Community</span>. Esta jerarquía está
          cuidadosamente diseñada para que cada subtipo sea sustituible de forma
          segura.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          La Base: Entity con Eventos de Dominio
        </h3>

        <CodeBlock language="csharp">{`// De: Gathering.SharedKernel/Entity.cs
public abstract class Entity
{
    private readonly List<IDomainEvent> _domainEvents = [];

    public IReadOnlyCollection<IDomainEvent> DomainEvents => 
        _domainEvents.AsReadOnly();

    public void ClearDomainEvents()
    {
        _domainEvents.Clear();
    }

    protected void Raise(IDomainEvent domainEvent)
    {
        _domainEvents.Add(domainEvent);
    }
}`}</CodeBlock>

        <p className="mt-4">
          Entity establece un contrato: cada entidad puede levantar y limpiar
          eventos de dominio. Este es el comportamiento base que todos los
          subtipos deben respetar.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          La Extensión: AuditableEntity
        </h3>

        <CodeBlock language="csharp">{`// De: Gathering.SharedKernel/AuditableEntity.cs
public abstract class AuditableEntity : Entity, IAuditable
{
    public DateTimeOffset CreatedAt { get; private set; }

    public DateTimeOffset? UpdatedAt { get; private set; }
}`}</CodeBlock>

        <p className="mt-4">
          AuditableEntity{" "}
          <span className="font-semibold">extiende sin violar</span> el contrato
          base. Agrega seguimiento de auditoría (CreatedAt, UpdatedAt) pero no
          cambia el comportamiento de los eventos de dominio. Cualquier código
          que funcione con Entity sigue funcionando perfectamente con
          AuditableEntity.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          Los Tipos Concretos: Session y Community
        </h3>

        <CodeBlock language="csharp">{`// De: Gathering.Domain/Sessions/Session.cs
public sealed partial class Session : AuditableEntity
{
    public Guid Id { get; private set; }
    public Guid CommunityId { get; private set; } = Guid.Empty;
    public string Title { get; private set; } = string.Empty;
    public string Speaker { get; private set; } = string.Empty;
    public DateTimeOffset ScheduledAt { get; private set; }
    public SessionStatus Status { get; private set; }

    public static Result<Session> Create(
        Guid communityId,
        string title,
        string speaker,
        DateTimeOffset scheduledAt,
        string? description = null,
        string? image = null)
    {
        // Validación...
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
}

// De: Gathering.Domain/Communities/Community.cs
public sealed class Community : AuditableEntity
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;

    public static Result<Community> Create(
        string name, string description, string? image = null)
    {
        // Validación...
        var community = new Community
        {
            Id = Guid.NewGuid(),
            Name = name,
            Description = description,
        };

        community.Raise(new CommunityCreatedDomainEvent(community.Id));
        return Result.Success(community);
    }
}`}</CodeBlock>

        <div className="rounded-lg border border-blue-600 bg-blue-50 p-4 my-6 dark:bg-blue-950/30">
          <p className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
            Por Qué Esta Jerarquía Respeta LSP:
          </p>
          <ul className="text-sm text-blue-900 dark:text-blue-100 space-y-2">
            <li>
              <span className="font-semibold">
                Contrato de Entity preservado:
              </span>{" "}
              Tanto Session como Community usan Raise() y ClearDomainEvents()
              exactamente como Entity los define. Sin overrides, sin sorpresas.
            </li>
            <li>
              <span className="font-semibold">
                AuditableEntity agrega, nunca cambia:
              </span>{" "}
              Los campos de auditoría son aditivos. El comportamiento existente
              no se toca.
            </li>
            <li>
              <span className="font-semibold">
                Clases selladas previenen violaciones:
              </span>{" "}
              Session y Community son <span className="font-mono">sealed</span>,
              previniendo que subtipos rompan sus contratos.
            </li>
            <li>
              <span className="font-semibold">
                El repositorio genérico funciona:
              </span>{" "}
              <span className="font-mono">
                {"IRepository<T> where T : Entity"}
              </span>{" "}
              funciona idénticamente para Session, Community o cualquier entidad
              futura.
            </li>
          </ul>
        </div>
      </div>

      {/* Caso de Estudio: Máquina de Estados */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Caso de Estudio: Máquina de Estados de Session
        </h2>

        <p>
          Un escenario LSP más sutil involucra las transiciones de estado de
          sesión de Gathering. La entidad Session gestiona una máquina de
          estados: <span className="font-mono">Scheduled</span> →{" "}
          <span className="font-mono">Completed</span> /{" "}
          <span className="font-mono">Canceled</span>. Esta máquina de estados
          define un contrato de comportamiento que debe respetarse.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          El Código Real: Transiciones de Estado con Validación
        </h3>

        <CodeBlock language="csharp">{`// De: Gathering.Domain/Sessions/SessionStatus.cs
public enum SessionStatus
{
    Scheduled = 0,
    Completed = 1,
    Canceled = 2
}

// De: Gathering.Domain/Sessions/Session.cs
public Result UpdateStatus(SessionStatus newStatus)
{
    if (Status == SessionStatus.Canceled && 
        newStatus == SessionStatus.Scheduled)
    {
        return Result.Failure(SessionError.InvalidStatusTransition);
    }

    if (Status == SessionStatus.Completed && 
        newStatus == SessionStatus.Scheduled)
    {
        return Result.Failure(SessionError.InvalidStatusTransition);
    }

    Status = newStatus;
    return Result.Success();
}`}</CodeBlock>

        <p className="mt-4">
          Este es un contrato claro: una vez que una sesión está Cancelada o
          Completada, no puede volver a Programada. Cualquier consumidor de
          Session puede confiar en este invariante.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          La Violación: Un Subtipo que Ignora la Máquina de Estados
        </h3>

        <p>
          Imagina que un desarrollador necesita una funcionalidad de
          &ldquo;sesión recurrente&rdquo;. En lugar de extender el dominio
          correctamente, crea una subclase que sobreescribe las reglas de la
          máquina de estados:
        </p>

        <CodeBlock language="csharp">{`// ✗ VIOLACIÓN: Este subtipo rompe el contrato de Session
public class RecurringSession : Session  // Nota: Session es sealed en Gathering,
{                                        // pero imagina que no lo fuera
    public DayOfWeek RecurrenceDay { get; set; }

    // Viola LSP: elimina la restricción que previene
    // transiciones Canceled → Scheduled
    public new Result UpdateStatus(SessionStatus newStatus)
    {
        // "Las sesiones recurrentes siempre pueden reprogramarse"
        // Esto ROMPE el contrato establecido por Session
        Status = newStatus;
        return Result.Success();
    }
}

// Código cliente que confía en el contrato de Session
public class SessionDashboardService
{
    private readonly ISessionRepository _repository;

    public async Task<IReadOnlyList<Session>> GetReschedulableSessions(
        CancellationToken cancellationToken)
    {
        var sessions = await _repository.GetAllAsync(cancellationToken);

        // Este código CONFÍA en el contrato de Session:
        // "Las sesiones canceladas no pueden reprogramarse"
        return sessions
            .Where(s => s.Status == SessionStatus.Scheduled)
            .ToList()
            .AsReadOnly();
    }
}

// El problema: si RecurringSession está en la lista,
// una sesión cancelada podría silenciosamente volver a "Scheduled",
// enviando notificaciones a asistentes por una sesión cancelada.
// La UI la muestra como reprogramable. Los asistentes se confunden.
// El contrato está roto.`}</CodeBlock>

        <div className="rounded-lg border border-red-600 bg-red-50 p-4 my-4 dark:bg-red-950/30">
          <p className="font-semibold text-red-900 dark:text-red-100 mb-3">
            Por Qué Esto Viola LSP:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-red-900 dark:text-red-100">
            <li>
              <span className="font-semibold">Postcondición debilitada:</span>{" "}
              Session garantiza que Canceled → Scheduled falla. RecurringSession
              elimina esta garantía.
            </li>
            <li>
              <span className="font-semibold">
                Expectativas del cliente rotas:
              </span>{" "}
              Cualquier código que filtre por Status confía en la máquina de
              estados. Una sesión recurrente que elude las reglas produce
              estados inválidos.
            </li>
            <li>
              <span className="font-semibold">
                Corrupción silenciosa de datos:
              </span>{" "}
              No se lanza ninguna excepción. El sistema entra silenciosamente en
              un estado inconsistente.
            </li>
            <li>
              <span className="font-semibold">
                Ocultamiento de método (no sobreescritura):
              </span>{" "}
              Usar <span className="font-mono">new</span> en vez de{" "}
              <span className="font-mono">override</span> significa que el
              comportamiento depende del tipo de referencia, no del objeto real,
              una trampa peligrosa.
            </li>
          </ul>
        </div>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          El Enfoque Correcto: Composición sobre Herencia
        </h3>

        <p>
          Gathering sabiamente evita este problema por completo. Session es{" "}
          <span className="font-mono">sealed</span>, previniendo que subclases
          rompan su contrato. Para sesiones recurrentes, el enfoque correcto usa
          composición:
        </p>

        <CodeBlock language="csharp">{`// ✓ CORRECTO: La composición preserva el contrato de Session
public sealed class RecurrenceSchedule : AuditableEntity
{
    public Guid Id { get; private set; }
    public Guid CommunityId { get; private set; }
    public DayOfWeek RecurrenceDay { get; private set; }
    public TimeOnly RecurrenceTime { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string Speaker { get; private set; } = string.Empty;

    // Crea una NUEVA sesión para cada ocurrencia
    // La máquina de estados de Session permanece intacta
    public Result<Session> CreateNextOccurrence()
    {
        var nextDate = CalculateNextDate();

        // Usa el método factory REAL Session.Create()
        // Todas las validaciones y reglas de máquina de estados aplican
        return Session.Create(
            CommunityId,
            Title,
            Speaker,
            nextDate);
    }

    private DateTimeOffset CalculateNextDate()
    {
        var today = DateTimeOffset.UtcNow;
        var daysUntilNext = ((int)RecurrenceDay - (int)today.DayOfWeek + 7) % 7;
        if (daysUntilNext == 0) daysUntilNext = 7;

        return today.AddDays(daysUntilNext)
            .Date
            .Add(RecurrenceTime.ToTimeSpan())
            .ToDateTimeOffset();
    }
}

// Ahora las sesiones recurrentes crean instancias propias de Session
// Cada sesión tiene su propia máquina de estados independiente
// Cancelar una ocurrencia no afecta a las demás`}</CodeBlock>

        <div className="rounded-lg border border-green-600 bg-green-50 p-4 my-6 dark:bg-green-950/30">
          <p className="font-semibold text-green-900 dark:text-green-100 mb-3">
            Por Qué la Composición Respeta LSP:
          </p>
          <ul className="text-sm text-green-900 dark:text-green-100 space-y-2">
            <li>
              <span className="font-semibold">
                ✓ Contrato de Session intacto:
              </span>{" "}
              Cada sesión pasa por Session.Create() y sigue las mismas reglas de
              máquina de estados.
            </li>
            <li>
              <span className="font-semibold">✓ Sin overrides ocultos:</span>{" "}
              RecurrenceSchedule no pretende ser un Session. Crea Sessions.
            </li>
            <li>
              <span className="font-semibold">
                ✓ Ciclos de vida independientes:
              </span>{" "}
              Cada ocurrencia es un Session completo con su propio estado.
              Cancelar uno no afecta a otros.
            </li>
            <li>
              <span className="font-semibold">
                ✓ Compatibilidad con el repositorio:
              </span>{" "}
              Todas las sesiones funcionan con ISessionRepository sin manejo
              especial.
            </li>
          </ul>
        </div>
      </div>

      {/* Cómo el Repositorio Genérico Depende de LSP */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Cómo el Repositorio Genérico Depende de LSP
        </h2>

        <p>
          El patrón repositorio de Gathering es un ejemplo práctico de LSP en
          acción. La interfaz genérica{" "}
          <span className="font-mono">{"IRepository<T>"}</span> funciona con
          cualquier subtipo de Entity porque la jerarquía respeta la
          sustituibilidad.
        </p>

        <CodeBlock language="csharp">{`// De: Gathering.Domain/Abstractions/IRepository.cs
public interface IRepository<T> where T : Entity
{
    Task<T?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<T>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<T>> FindAsync(
        Expression<Func<T, bool>> predicate,
        CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default);

    void Add(T entity);
    void Update(T entity);
    void Remove(T entity);
}

// Los repositorios especializados extienden sin romper el contrato
public interface ISessionRepository : IRepository<Session>
{
    Task<IReadOnlyList<Session>> GetByCommunityIdAsync(
        Guid communityId,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Session>> GetActiveSessionsAsync(
        CancellationToken cancellationToken = default);
}

public interface ICommunityRepository : IRepository<Community>
{
    // No se necesitan métodos adicionales - el contrato base es suficiente
}`}</CodeBlock>

        <p className="mt-4">
          Esto funciona gracias a LSP:{" "}
          <span className="font-semibold">
            cada subtipo de Entity se comporta consistentemente
          </span>
          . El repositorio genérico puede Add, Update, Remove y consultar
          cualquier entidad sin preocuparse de que los subtipos rompan el
          comportamiento esperado.
        </p>

        <CodeBlock language="csharp">{`// De: Gathering.Infrastructure/Repositories/SessionRepository.cs
internal sealed class SessionRepository : ISessionRepository
{
    private readonly ApplicationDbContext _dbContext;

    public SessionRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // Los métodos base de IRepository<Session> funcionan porque
    // Session es un subtipo apropiado de Entity
    public void Add(Session entity)
    {
        _dbContext.Sessions.Add(entity);
    }

    public async Task<Session?> GetByIdAsync(
        Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Sessions
            .Include(s => s.Resources)
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
    }

    // Métodos extendidos específicos de Session
    public async Task<IReadOnlyList<Session>> GetByCommunityIdAsync(
        Guid communityId, CancellationToken cancellationToken = default)
    {
        var sessions = await _dbContext.Sessions
            .Where(s => s.CommunityId == communityId)
            .ToListAsync(cancellationToken);

        return sessions.AsReadOnly();
    }

    public async Task<IReadOnlyList<Session>> GetActiveSessionsAsync(
        CancellationToken cancellationToken = default)
    {
        var sessions = await _dbContext.Sessions
            .Where(s => s.Status == SessionStatus.Scheduled)
            .ToListAsync(cancellationToken);

        return sessions.AsReadOnly();
    }
}`}</CodeBlock>
      </div>

      {/* Entendiendo los Contratos LSP */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Entendiendo los Contratos LSP
        </h2>

        <p>
          LSP define tres reglas que los subtipos deben seguir. Veamos cómo
          Gathering respeta cada una:
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          1. Las Precondiciones No Pueden Fortalecerse
        </h3>
        <p>
          Un subtipo no puede exigir más que su tipo base. Si Entity acepta
          cualquier evento de dominio, AuditableEntity también debe aceptar
          cualquier evento de dominio. No puede agregar restricciones como
          &ldquo;solo acepta eventos de auditoría.&rdquo;
        </p>

        <CodeBlock language="csharp">{`// ✓ Gathering: AuditableEntity no restringe Raise()
public abstract class AuditableEntity : Entity, IAuditable
{
    // Raise() funciona exactamente como Entity lo define
    // No se agregan precondiciones extra
}

// ✗ Violación: Fortaleciendo precondiciones
public class RestrictedEntity : Entity
{
    protected new void Raise(IDomainEvent domainEvent)
    {
        // VIOLACIÓN: Ahora requiere un tipo de evento específico
        if (domainEvent is not AuditEvent)
            throw new ArgumentException("Solo eventos de auditoría permitidos");

        base.Raise(domainEvent);
    }
}`}</CodeBlock>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          2. Las Postcondiciones No Pueden Debilitarse
        </h3>
        <p>
          Un subtipo debe garantizar al menos tanto como su tipo base. Si
          Session.UpdateStatus() garantiza que las transiciones inválidas
          retornan un resultado Failure, un subtipo no puede tener éxito
          silenciosamente en su lugar.
        </p>

        <CodeBlock language="csharp">{`// ✓ Gathering: Session garantiza que las transiciones inválidas fallan
public Result UpdateStatus(SessionStatus newStatus)
{
    if (Status == SessionStatus.Canceled && 
        newStatus == SessionStatus.Scheduled)
    {
        return Result.Failure(SessionError.InvalidStatusTransition);
    }

    Status = newStatus;
    return Result.Success();
}

// ✗ Violación: Debilitando postcondiciones (el ejemplo de RecurringSession)
// Un subtipo que siempre retorna Success elimina la garantía
// de que las transiciones inválidas son rechazadas`}</CodeBlock>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          3. Los Invariantes Deben Preservarse
        </h3>
        <p>
          Un subtipo debe mantener todos los invariantes de su tipo base. Si
          Entity garantiza que DomainEvents nunca es null, cada subtipo debe
          mantener esto.
        </p>

        <CodeBlock language="csharp">{`// ✓ Gathering: Entity inicializa _domainEvents en la declaración
private readonly List<IDomainEvent> _domainEvents = [];

// Esto garantiza que DomainEvents nunca es null
// Cada subtipo hereda este invariante automáticamente

// ✗ Violación: Un subtipo que rompe el invariante
public class BrokenEntity : Entity
{
    public BrokenEntity()
    {
        // Llamar ClearDomainEvents() en el constructor está bien...
        // Pero si de alguna manera nullificaras _domainEvents,
        // cualquier código que llame entity.DomainEvents fallaría
    }
}`}</CodeBlock>
      </div>

      {/* Sección TypeScript */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          LSP en TypeScript
        </h2>

        <p>
          Los mismos principios aplican en TypeScript. Aquí está el patrón de
          jerarquía de entidades traducido a un contexto Node.js/Express:
        </p>

        <CodeBlock language="typescript">
          {`// Entidad base con eventos de dominio
abstract class Entity {
  private readonly domainEvents: DomainEvent[] = [];

  get events(): ReadonlyArray<DomainEvent> {
    return [...this.domainEvents];
  }

  clearDomainEvents(): void {
    this.domainEvents.length = 0;
  }

  protected raise(event: DomainEvent): void {
    this.domainEvents.push(event);
  }
}

// Extensión auditable - agrega sin cambiar comportamiento base
abstract class AuditableEntity extends Entity {
  readonly createdAt: Date;
  updatedAt?: Date;

  constructor() {
    super(); // Contrato de Entity preservado
    this.createdAt = new Date();
  }
}

// Session con máquina de estados
type SessionStatus = "scheduled" | "completed" | "canceled";

class Session extends AuditableEntity {
  private _status: SessionStatus = "scheduled";

  get status(): SessionStatus {
    return this._status;
  }

  static create(
    communityId: string,
    title: string,
    speaker: string,
    scheduledAt: Date
  ): Result<Session> {
    if (!title.trim()) {
      return failure("El título es obligatorio");
    }

    if (scheduledAt <= new Date()) {
      return failure("La fecha debe ser en el futuro");
    }

    const session = new Session();
    session.communityId = communityId;
    session.title = title;
    session.speaker = speaker;
    session.scheduledAt = scheduledAt;

    session.raise({ type: "SessionCreated", sessionId: session.id });
    return success(session);
  }

  updateStatus(newStatus: SessionStatus): Result<void> {
    if (this._status === "canceled" && newStatus === "scheduled") {
      return failure("No se puede reprogramar una sesión cancelada");
    }

    if (this._status === "completed" && newStatus === "scheduled") {
      return failure("No se puede reprogramar una sesión completada");
    }

    this._status = newStatus;
    return success(undefined);
  }
}

// ✗ Violación de LSP en TypeScript
class RecurringSession extends Session {
  // Sobreescribe la máquina de estados - rompe el contrato
  updateStatus(newStatus: SessionStatus): Result<void> {
    // Permite silenciosamente TODAS las transiciones
    this._status = newStatus;
    return success(undefined);
  }
}

// ✓ Compatible con LSP: Usar composición
class RecurrenceSchedule {
  constructor(
    private communityId: string,
    private title: string,
    private speaker: string,
    private recurrenceDay: number
  ) {}

  createNextOccurrence(): Result<Session> {
    const nextDate = this.calculateNextDate();
    // Delega a Session.create() - todas las reglas aplican
    return Session.create(
      this.communityId,
      this.title,
      this.speaker,
      nextDate
    );
  }

  private calculateNextDate(): Date {
    const today = new Date();
    const daysUntil = (this.recurrenceDay - today.getDay() + 7) % 7 || 7;
    return new Date(today.getTime() + daysUntil * 86400000);
  }
}`}
        </CodeBlock>
      </div>

      {/* Beneficios */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Beneficios de Aplicar LSP
        </h2>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          1. Polimorfismo en el que Puedes Confiar
        </h3>
        <p>
          Cuando los subtipos honran el contrato base, puedes usar polimorfismo
          sin miedo. <span className="font-mono">{"IRepository<T>"}</span>{" "}
          funciona con cualquier entidad porque cada entidad se comporta como
          Entity promete.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          2. El Código Genérico Simplemente Funciona
        </h3>
        <p>
          El repositorio genérico de Gathering, el middleware que procesa
          eventos de dominio y las configuraciones de EF Core todo funciona
          porque cada entidad es un subtipo apropiado de Entity. Sin casos
          especiales. Sin verificaciones de tipo.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          3. Extensión Segura
        </h3>
        <p>
          Agregar un nuevo tipo de entidad (ej., una entidad
          &ldquo;Resource&rdquo;) es seguro. Extiende AuditableEntity,
          implementa las propiedades requeridas, y todo, repositorios,
          procesamiento de eventos, auditoría, funciona automáticamente.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          4. Depuración Más Fácil
        </h3>
        <p>
          Cuando los subtipos respetan los contratos, los bugs están
          localizados. Si GetAllAsync() retorna datos inesperados, sabes que el
          problema está en la lógica de consulta, no en un subtipo que cambió
          secretamente cómo funciona Add().
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          5. OCP se Vuelve Confiable
        </h3>
        <p>
          OCP dice &ldquo;extiende a través de nuevas implementaciones.&rdquo;
          Pero la extensión solo funciona si las nuevas implementaciones honran
          el contrato. LSP es lo que hace que OCP sea seguro.
        </p>
      </div>

      {/* Trampas */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Trampas del Mundo Real
        </h2>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          Trampa 1: Heredar para Reutilizar Código, No Comportamiento
        </h3>
        <p>
          La herencia debe modelar relaciones &ldquo;es-un&rdquo;, no
          &ldquo;tiene-código-que-quiero.&rdquo; Un RecurringSession no es un
          Session con reglas diferentes, es un schedule que crea sessions. Usa
          composición cuando quieras reutilizar código sin sustituibilidad de
          comportamiento.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          Trampa 2: Lanzar NotImplementedException
        </h3>
        <p>
          Si un subtipo lanza{" "}
          <span className="font-mono">NotImplementedException</span> para un
          método definido en el tipo base, eso es una violación de LSP. El tipo
          base promete que el método funciona; el subtipo rompe esa promesa.
        </p>
        <p className="text-sm italic mt-2">
          Mejor: Si un método no aplica, el tipo probablemente no debería
          heredar de esa base.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          Trampa 3: Usar Verificaciones de Tipo en Vez de Polimorfismo
        </h3>
        <p>
          Si te encuentras escribiendo{" "}
          <span className="font-mono">if (entity is RecurringSession)</span>, es
          una señal de que el subtipo no es sustituible apropiadamente. El
          verdadero polimorfismo significa que nunca necesitas verificar el tipo
          concreto.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          Trampa 4: Ignorar Clases Selladas
        </h3>
        <p>
          Gathering marca las entidades concretas como{" "}
          <span className="font-mono">sealed</span>. Esto es intencional:
          Session y Community tienen contratos específicos (máquinas de estado,
          reglas de validación) que las subclases podrían romper fácilmente. Si
          una clase tiene invariantes de comportamiento, considera sellarla y
          usar composición para extensión.
        </p>
      </div>

      {/* Checklist */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Checklist: Detectando Violaciones de LSP
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
              ¿Un subtipo lanza excepciones que el tipo base no declara?
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
              ¿Un subtipo ignora o cambia silenciosamente el comportamiento de
              un método heredado?
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
              ¿Necesitas verificaciones de tipo ({" "}
              <span className="font-mono">is</span>,{" "}
              <span className="font-mono">instanceof</span>) para manejar
              subtipos específicos?
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
              ¿Intercambiar un subtipo en código existente causaría
              comportamiento inesperado?
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
              ¿Una subclase sobreescribe un método con{" "}
              <span className="font-mono">new</span> en vez de{" "}
              <span className="font-mono">override</span>?
            </label>
          </div>
        </div>

        <p>
          Si respondes &ldquo;sí&rdquo; a alguna de estas, LSP probablemente
          está siendo violado.
        </p>
      </div>

      {/* Conclusión */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Conclusión</h2>

        <p>
          El Principio de Sustitución de Liskov asegura que las jerarquías de
          herencia son confiables. Cuando los subtipos honran los contratos
          establecidos por sus tipos base, el polimorfismo funciona de manera
          confiable, el código genérico se mantiene genérico, y la extensión a
          través de nuevos tipos es segura.
        </p>

        <p>
          Gathering demuestra esto a través de su jerarquía de entidades: Entity
          → AuditableEntity → Session/Community. Cada nivel agrega
          comportamiento sin romper el contrato superior. El repositorio
          genérico funciona con cualquier entidad. La máquina de estados en
          Session impone reglas que ningún subtipo puede eludir silenciosamente,
          porque la clase es sealed.
        </p>

        <p>
          La idea clave:{" "}
          <span className="font-semibold">
            la herencia no se trata de reutilización de código, se trata de
            compatibilidad de comportamiento
          </span>
          . Si un subtipo no puede honrar cada promesa de su tipo base, usa
          composición en su lugar.
        </p>

        <p>
          En el próximo artículo, exploramos el Principio de Segregación de
          Interfaces, que asegura que las interfaces son lo suficientemente
          enfocadas para que ninguna implementación se vea forzada a depender de
          métodos que no usa.
        </p>
      </div>
    </>
  );
}
