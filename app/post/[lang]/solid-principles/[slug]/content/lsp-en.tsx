import { CodeBlock } from "@/components/code-block";

export function LspContentEn() {
  return (
    <>
      {/* Introduction */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Introduction</h2>
        <p>
          The Liskov Substitution Principle (LSP) states:{" "}
          <span className="font-semibold">
            subtypes must be substitutable for their base types without altering
            the correctness of the program
          </span>
          . In simpler terms, if your code works with a base class, it should
          work identically when you swap in any subclass, no surprises, no
          broken contracts.
        </p>
        <p>
          LSP is often misunderstood as &ldquo;subclasses should inherit
          properly.&rdquo; But it goes deeper: it defines a behavioral contract.
          A subclass that throws unexpected exceptions, ignores preconditions,
          or changes the meaning of a method violates LSP, even if it compiles
          perfectly.
        </p>
        <p>
          This principle matters because OCP depends on it. If you design a
          system for extension (OCP), the new implementations must behave
          consistently with the expectations set by the base type. Otherwise,
          polymorphism becomes a trap: code that works with the base type
          silently breaks when handed a subtype.
        </p>
        <p>
          In this article, we explore LSP through a real-world scenario:
          building a Community of Practice management system. You will see how
          Gathering&apos;s entity hierarchy and state machine design uphold LSP,
          and what happens when a naive subclass violates it.
        </p>
      </div>

      {/* The Problem */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          The Problem: Subtypes That Break Expectations
        </h2>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          A Simple Example: Shapes and Area Calculation
        </h3>

        <p>
          Before diving into the Gathering codebase, let&apos;s see the classic
          LSP violation: the Rectangle/Square problem. This illustrates the core
          principle without needing application context.
        </p>

        <h4 className="text-base font-semibold text-foreground mt-4">
          Without LSP: A Square That Breaks the Rectangle Contract
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
    // A square forces Width and Height to be equal
    public override int Width
    {
        get => base.Width;
        set
        {
            base.Width = value;
            base.Height = value; // Surprise! Setting Width also changes Height
        }
    }

    public override int Height
    {
        get => base.Height;
        set
        {
            base.Height = value;
            base.Width = value; // Surprise! Setting Height also changes Width
        }
    }
}

// Client code that works with Rectangle
public void ResizeAndCheck(Rectangle rect)
{
    rect.Width = 5;
    rect.Height = 10;

    // Expectation: Area should be 50
    Console.WriteLine(rect.CalculateArea());
    // With Rectangle: 50 ✓
    // With Square:    100 ✗  (Width was overwritten to 10!)
}`}</CodeBlock>

        <p className="mt-4">
          <span className="font-semibold">The problem:</span> Square overrides
          the setter behavior, violating the contract that Width and Height are
          independent. Any code that sets them separately will produce incorrect
          results when given a Square. The subtype is{" "}
          <span className="font-semibold">not safely substitutable</span>.
        </p>

        <h4 className="text-base font-semibold text-foreground mt-4">
          With LSP: Separate Types with a Shared Interface
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

// Client code works with IShape - no assumptions broken
public void PrintArea(IShape shape)
{
    Console.WriteLine(shape.CalculateArea()); // Always correct
}`}</CodeBlock>

        <div className="rounded-lg border border-green-600 bg-green-50 p-4 my-6 dark:bg-green-950/30">
          <p className="font-semibold text-green-900 dark:text-green-100 mb-3">
            Benefits of LSP Here:
          </p>
          <ul className="text-sm text-green-900 dark:text-green-100 space-y-2">
            <li>
              <span className="font-semibold">✓ No hidden side effects:</span>{" "}
              Each shape calculates area correctly without unexpected property
              coupling.
            </li>
            <li>
              <span className="font-semibold">✓ Safe substitution:</span> Any
              IShape can be used anywhere without breaking client code.
            </li>
            <li>
              <span className="font-semibold">✓ Clear contracts:</span> Each
              type has its own appropriate properties (Width/Height vs Side).
            </li>
          </ul>
        </div>

        <p className="mt-6">
          This simple pattern (avoiding inheritance that changes the meaning of
          the base type) is the foundation of LSP. Now let&apos;s apply it to a
          larger, real-world system.
        </p>
      </div>

      {/* Case Study: Entity Hierarchy */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Case Study: Entity Hierarchy in Gathering
        </h2>

        <p>
          The Gathering application (a Community of Practice management system)
          uses a layered entity hierarchy:{" "}
          <span className="font-mono">Entity</span> →{" "}
          <span className="font-mono">AuditableEntity</span> →{" "}
          <span className="font-mono">Session</span> /{" "}
          <span className="font-mono">Community</span>. This hierarchy is
          carefully designed so every subtype is safely substitutable.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          The Base: Entity with Domain Events
        </h3>

        <CodeBlock language="csharp">{`// From: Gathering.SharedKernel/Entity.cs
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
          Entity establishes a contract: every entity can raise and clear domain
          events. This is the base behavior that all subtypes must respect.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          The Extension: AuditableEntity
        </h3>

        <CodeBlock language="csharp">{`// From: Gathering.SharedKernel/AuditableEntity.cs
public abstract class AuditableEntity : Entity, IAuditable
{
    public DateTimeOffset CreatedAt { get; private set; }

    public DateTimeOffset? UpdatedAt { get; private set; }
}`}</CodeBlock>

        <p className="mt-4">
          AuditableEntity{" "}
          <span className="font-semibold">extends without violating</span> the
          base contract. It adds audit tracking (CreatedAt, UpdatedAt) but does
          not change the behavior of domain events. Any code that works with
          Entity still works perfectly with AuditableEntity.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          The Concrete Types: Session and Community
        </h3>

        <CodeBlock language="csharp">{`// From: Gathering.Domain/Sessions/Session.cs
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
        // Validation...
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

// From: Gathering.Domain/Communities/Community.cs
public sealed class Community : AuditableEntity
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;

    public static Result<Community> Create(
        string name, string description, string? image = null)
    {
        // Validation...
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
            Why This Hierarchy Respects LSP:
          </p>
          <ul className="text-sm text-blue-900 dark:text-blue-100 space-y-2">
            <li>
              <span className="font-semibold">Entity contract preserved:</span>{" "}
              Both Session and Community use Raise() and ClearDomainEvents()
              exactly as Entity defines. No overrides, no surprises.
            </li>
            <li>
              <span className="font-semibold">
                AuditableEntity adds, never changes:
              </span>{" "}
              Audit fields are additive. Existing behavior is untouched.
            </li>
            <li>
              <span className="font-semibold">
                Sealed classes prevent violations:
              </span>{" "}
              Session and Community are{" "}
              <span className="font-mono">sealed</span>, preventing subtypes
              from breaking their contracts.
            </li>
            <li>
              <span className="font-semibold">Generic repository works:</span>{" "}
              <span className="font-mono">
                {"IRepository<T> where T : Entity"}
              </span>{" "}
              works identically for Session, Community, or any future entity.
            </li>
          </ul>
        </div>
      </div>

      {/* Case Study: State Machine */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Case Study: Session State Machine
        </h2>

        <p>
          A more subtle LSP scenario involves Gathering&apos;s session status
          transitions. The Session entity manages a state machine:{" "}
          <span className="font-mono">Scheduled</span> →{" "}
          <span className="font-mono">Completed</span> /{" "}
          <span className="font-mono">Canceled</span>. This state machine
          defines a behavioral contract that must be respected.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          The Real Code: State Transitions with Validation
        </h3>

        <CodeBlock language="csharp">{`// From: Gathering.Domain/Sessions/SessionStatus.cs
public enum SessionStatus
{
    Scheduled = 0,
    Completed = 1,
    Canceled = 2
}

// From: Gathering.Domain/Sessions/Session.cs
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
          This is a clear contract: once a session is Canceled or Completed, it
          cannot go back to Scheduled. Any consumer of Session can rely on this
          invariant.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          The Violation: A Subtype That Ignores the State Machine
        </h3>

        <p>
          Imagine a developer needs a &ldquo;recurring session&rdquo; feature.
          Instead of extending the domain properly, they create a subclass that
          overrides the state machine rules:
        </p>

        <CodeBlock language="csharp">{`// ✗ VIOLATION: This subtype breaks the Session contractantcurringSession example)
public class RecurringSession : Session  // Note: Session is sealed in Gathering,
{                                        // but imagine it wasn't
    public DayOfWeek RecurrenceDay { get; set; }

    // Violates LSP: removes the restriction that prevents
    // Canceled → Scheduled transitions
    public new Result UpdateStatus(SessionStatus newStatus)
    {
        // "Recurring sessions can always be rescheduled"
        // This BREAKS the contract established by Session
        Status = newStatus;
        return Result.Success();
    }
}

// Client code that relies on the Session contract
public class SessionDashboardService
{
    private readonly ISessionRepository _repository;

    public async Task<IReadOnlyList<Session>> GetReschedulableSessions(
        CancellationToken cancellationToken)
    {
        var sessions = await _repository.GetAllAsync(cancellationToken);

        // This code TRUSTS the Session contract:
        // "Canceled sessions cannot be rescheduled"
        return sessions
            .Where(s => s.Status == SessionStatus.Scheduled)
            .ToList()
            .AsReadOnly();
    }
}

// The problem: if RecurringSession is in the list,
// a canceled session could silently become "Scheduled" again,
// sending notifications to attendees for a session that was canceled.
// The UI shows it as reschedulable. Attendees get confused.
// The contract is broken.`}</CodeBlock>

        <div className="rounded-lg border border-red-600 bg-red-50 p-4 my-4 dark:bg-red-950/30">
          <p className="font-semibold text-red-900 dark:text-red-100 mb-3">
            Why This Violates LSP:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-red-900 dark:text-red-100">
            <li>
              <span className="font-semibold">Weakened postcondition:</span>{" "}
              Session guarantees that Canceled → Scheduled fails.
              RecurringSession removes this guarantee.
            </li>
            <li>
              <span className="font-semibold">Broken client expectations:</span>{" "}
              Any code filtering by Status trusts the state machine. A recurring
              session that bypasses rules produces invalid states.
            </li>
            <li>
              <span className="font-semibold">Silent data corruption:</span> No
              exception is thrown. The system quietly enters an inconsistent
              state.
            </li>
            <li>
              <span className="font-semibold">
                Method hiding (not overriding):
              </span>{" "}
              Using <span className="font-mono">new</span> instead of{" "}
              <span className="font-mono">override</span> means behavior depends
              on the reference type, not the actual object, a dangerous trap.
            </li>
          </ul>
        </div>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          The Right Approach: Composition Over Inheritance
        </h3>

        <p>
          Gathering wisely avoids this problem entirely. Session is{" "}
          <span className="font-mono">sealed</span>, preventing subclasses from
          breaking its contract. For recurring sessions, the correct approach
          uses composition:
        </p>

        <CodeBlock language="csharp">{`// ✓ CORRECT: Composition preserves the Session contract
public sealed class RecurrenceSchedule : AuditableEntity
{
    public Guid Id { get; private set; }
    public Guid CommunityId { get; private set; }
    public DayOfWeek RecurrenceDay { get; private set; }
    public TimeOnly RecurrenceTime { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string Speaker { get; private set; } = string.Empty;

    // Creates a NEW session for each occurrence
    // The Session's state machine remains intact
    public Result<Session> CreateNextOccurrence()
    {
        var nextDate = CalculateNextDate();

        // Uses the REAL Session.Create() factory method
        // All validations and state machine rules apply
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

// Now recurring sessions create proper Session instances
// Each session has its own independent state machine
// Canceling one occurrence doesn't affect others`}</CodeBlock>

        <div className="rounded-lg border border-green-600 bg-green-50 p-4 my-6 dark:bg-green-950/30">
          <p className="font-semibold text-green-900 dark:text-green-100 mb-3">
            Why Composition Respects LSP:
          </p>
          <ul className="text-sm text-green-900 dark:text-green-100 space-y-2">
            <li>
              <span className="font-semibold">✓ Session contract intact:</span>{" "}
              Every session goes through Session.Create() and follows the same
              state machine rules.
            </li>
            <li>
              <span className="font-semibold">✓ No hidden overrides:</span>{" "}
              RecurrenceSchedule doesn&apos;t pretend to be a Session. It
              creates Sessions.
            </li>
            <li>
              <span className="font-semibold">✓ Independent lifecycles:</span>{" "}
              Each occurrence is a full Session with its own status. Canceling
              one doesn&apos;t affect others.
            </li>
            <li>
              <span className="font-semibold">✓ Repository compatibility:</span>{" "}
              All sessions work with ISessionRepository without special
              handling.
            </li>
          </ul>
        </div>
      </div>

      {/* How the Generic Repository Relies on LSP */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          How the Generic Repository Relies on LSP
        </h2>

        <p>
          Gathering&apos;s repository pattern is a practical example of LSP in
          action. The generic{" "}
          <span className="font-mono">{"IRepository<T>"}</span> interface works
          with any Entity subtype because the hierarchy respects
          substitutability.
        </p>

        <CodeBlock language="csharp">{`// From: Gathering.Domain/Abstractions/IRepository.cs
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

// Specialized repositories extend without breaking the contract
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
    // No additional methods needed - the base contract is sufficient
}`}</CodeBlock>

        <p className="mt-4">
          This works because of LSP:{" "}
          <span className="font-semibold">
            every Entity subtype behaves consistently
          </span>
          . The generic repository can Add, Update, Remove, and query any entity
          without worrying about subtypes breaking expected behavior.
        </p>

        <CodeBlock language="csharp">{`// From: Gathering.Infrastructure/Repositories/SessionRepository.cs
internal sealed class SessionRepository : ISessionRepository
{
    private readonly ApplicationDbContext _dbContext;

    public SessionRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // Base IRepository<Session> methods work because
    // Session is a proper subtype of Entity
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

    // Extended methods specific to Session
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

      {/* Understanding LSP Contracts */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Understanding LSP Contracts
        </h2>

        <p>
          LSP defines three rules that subtypes must follow. Let&apos;s see how
          Gathering respects each one:
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          1. Preconditions Cannot Be Strengthened
        </h3>
        <p>
          A subtype cannot demand more than its base type. If Entity accepts any
          domain event, AuditableEntity must also accept any domain event. It
          cannot add restrictions like &ldquo;only accept audit events.&rdquo;
        </p>

        <CodeBlock language="csharp">{`// ✓ Gathering: AuditableEntity does not restrict Raise()
public abstract class AuditableEntity : Entity, IAuditable
{
    // Raise() works exactly as Entity defines it
    // No extra preconditions are added
}

// ✗ Violation: Strengthening preconditions
public class RestrictedEntity : Entity
{
    protected new void Raise(IDomainEvent domainEvent)
    {
        // VIOLATION: Now requires a specific event type
        if (domainEvent is not AuditEvent)
            throw new ArgumentException("Only audit events allowed");

        base.Raise(domainEvent);
    }
}`}</CodeBlock>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          2. Postconditions Cannot Be Weakened
        </h3>
        <p>
          A subtype must guarantee at least as much as its base type. If
          Session.UpdateStatus() guarantees that invalid transitions return a
          Failure result, a subtype cannot silently succeed instead.
        </p>

        <CodeBlock language="csharp">{`// ✓ Gathering: Session guarantees invalid transitions fail
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

// ✗ Violation: Weakening postconditions (the RecurringSession example)
// A subtype that always returns Success removes the guarantee
// that invalid transitions are rejected`}</CodeBlock>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          3. Invariants Must Be Preserved
        </h3>
        <p>
          A subtype must maintain all invariants of its base type. If Entity
          guarantees that DomainEvents is never null, every subtype must
          maintain this.
        </p>

        <CodeBlock language="csharp">{`// ✓ Gathering: Entity initializes _domainEvents in declaration
private readonly List<IDomainEvent> _domainEvents = [];

// This guarantees DomainEvents is never null
// Every subtype inherits this invariant automatically

// ✗ Violation: A subtype that breaks the invariant
public class BrokenEntity : Entity
{
    public BrokenEntity()
    {
        // Calling ClearDomainEvents() in constructor is fine...
        // But if you somehow nullified _domainEvents,
        // any code calling entity.DomainEvents would crash
    }
}`}</CodeBlock>
      </div>

      {/* TypeScript Section */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          LSP in TypeScript
        </h2>

        <p>
          The same principles apply in TypeScript. Here is the entity hierarchy
          pattern translated to a Node.js/Express context:
        </p>

        <CodeBlock language="typescript">
          {`// Base entity with domain events
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

// Auditable extension - adds without changing base behavior
abstract class AuditableEntity extends Entity {
  readonly createdAt: Date;
  updatedAt?: Date;

  constructor() {
    super(); // Entity contract preserved
    this.createdAt = new Date();
  }
}

// Session with state machine
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
      return failure("Title is required");
    }

    if (scheduledAt <= new Date()) {
      return failure("Schedule must be in the future");
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
      return failure("Cannot reschedule a canceled session");
    }

    if (this._status === "completed" && newStatus === "scheduled") {
      return failure("Cannot reschedule a completed session");
    }

    this._status = newStatus;
    return success(undefined);
  }
}

// ✗ LSP Violation in TypeScript
class RecurringSession extends Session {
  // Overrides state machine - breaks the contract
  updateStatus(newStatus: SessionStatus): Result<void> {
    // Silently allows ALL transitions
    this._status = newStatus; // Would need to access private field
    return success(undefined);
  }
}

// ✓ LSP-Compliant: Use composition
class RecurrenceSchedule {
  constructor(
    private communityId: string,
    private title: string,
    private speaker: string,
    private recurrenceDay: number
  ) {}

  createNextOccurrence(): Result<Session> {
    const nextDate = this.calculateNextDate();
    // Delegates to Session.create() - all rules apply
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

      {/* Benefits */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Benefits of Applying LSP
        </h2>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          1. Polymorphism You Can Trust
        </h3>
        <p>
          When subtypes honor the base contract, you can use polymorphism
          fearlessly. <span className="font-mono">{"IRepository<T>"}</span>{" "}
          works with any entity because every entity behaves as Entity promises.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          2. Generic Code Just Works
        </h3>
        <p>
          Gathering&apos;s generic repository, middleware that processes domain
          events, and EF Core configurations all work because every entity is a
          proper subtype of Entity. No special cases. No type checks.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          3. Safe Extension
        </h3>
        <p>
          Adding a new entity type (e.g., a &ldquo;Resource&rdquo; entity) is
          safe. Extend AuditableEntity, implement the required properties, and
          everything (repositories, event processing, auditing) works
          automatically.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          4. Easier Debugging
        </h3>
        <p>
          When subtypes respect contracts, bugs are localized. If GetAllAsync()
          returns unexpected data, you know the issue is in the query logic, not
          in a subtype that secretly changed how Add() works.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          5. OCP Becomes Reliable
        </h3>
        <p>
          OCP says &ldquo;extend through new implementations.&rdquo; But
          extension only works if new implementations honor the contract. LSP is
          what makes OCP safe.
        </p>
      </div>

      {/* Pitfalls */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Real-World Pitfalls
        </h2>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          Pitfall 1: Inheriting for Code Reuse, Not Behavior
        </h3>
        <p>
          Inheritance should model &ldquo;is-a&rdquo; relationships, not
          &ldquo;has-some-code-I-want.&rdquo; A RecurringSession is not a
          Session with different rules, it is a schedule that creates sessions.
          Use composition when you want code reuse without behavioral
          substitutability.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          Pitfall 2: Throwing NotImplementedException
        </h3>
        <p>
          If a subtype throws{" "}
          <span className="font-mono">NotImplementedException</span> for a
          method defined in the base type, that is an LSP violation. The base
          type promises the method works; the subtype breaks that promise.
        </p>
        <p className="text-sm italic mt-2">
          Better: If a method does not apply, the type probably should not
          inherit from that base.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          Pitfall 3: Using Type Checks Instead of Polymorphism
        </h3>
        <p>
          If you find yourself writing{" "}
          <span className="font-mono">if (entity is RecurringSession)</span>, it
          is a sign that the subtype is not properly substitutable. True
          polymorphism means you never need to check the concrete type.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          Pitfall 4: Ignoring Sealed Classes
        </h3>
        <p>
          Gathering marks concrete entities as{" "}
          <span className="font-mono">sealed</span>. This is intentional:
          Session and Community have specific contracts (state machines,
          validation rules) that subclasses could easily break. If a class has
          behavioral invariants, consider sealing it and using composition for
          extension.
        </p>
      </div>

      {/* Checklist */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Checklist: Detecting LSP Violations
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
              Does a subtype throw exceptions that the base type does not
              declare?
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
              Does a subtype silently ignore or change the behavior of an
              inherited method?
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
              Do you need type checks ( <span className="font-mono">is</span>,{" "}
              <span className="font-mono">instanceof</span>) to handle specific
              subtypes?
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
              Would swapping a subtype into existing code cause unexpected
              behavior?
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
              Does a subclass override a method with{" "}
              <span className="font-mono">new</span> instead of{" "}
              <span className="font-mono">override</span>?
            </label>
          </div>
        </div>

        <p>
          If you answer &ldquo;yes&rdquo; to any of these, LSP is likely being
          violated.
        </p>
      </div>

      {/* Conclusion */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Conclusion</h2>

        <p>
          The Liskov Substitution Principle ensures that inheritance hierarchies
          are trustworthy. When subtypes honor the contracts established by
          their base types, polymorphism works reliably, generic code stays
          generic, and extension through new types is safe.
        </p>

        <p>
          Gathering demonstrates this through its entity hierarchy: Entity →
          AuditableEntity → Session/Community. Each level adds behavior without
          breaking the contract above it. The generic repository works with any
          entity. The state machine in Session enforces rules that no subtype
          can silently bypass, because the class is sealed.
        </p>

        <p>
          The key insight:{" "}
          <span className="font-semibold">
            inheritance is not about code reuse, it is about behavioral
            compatibility
          </span>
          . If a subtype cannot honor every promise of its base type, use
          composition instead.
        </p>

        <p>
          In the next article, we explore the Interface Segregation Principle,
          which ensures that interfaces are focused enough that no
          implementation is forced to depend on methods it does not use.
        </p>
      </div>
    </>
  );
}
