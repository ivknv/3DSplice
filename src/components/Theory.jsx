import React, {useRef, useEffect, useState} from "react";
import {useHideOnTransition} from "../common";
import Figure1 from "../images/1.png"
import Figure2 from "../images/2.png"
import Figure3 from "../images/3.png"
import Figure4 from "../images/4.png"
import Figure5 from "../images/5.png"
import Figure6 from "../images/7.png"
import Figure7 from "../images/8.png"
import Figure8 from "../images/9.jpg"
import Figure9 from "../images/10.png"

export default function Theory({visible = true, goNext}) {
    const theory = useRef(null);
    const [display, setDisplay] = useState(visible ? "flex" : "none");

    useEffect(() => {
        theory.current.scroll(0, 0);
    }, [display]);

    useEffect(() => {
        if (visible) {
            setDisplay("flex");
        }
    }, [visible]);

    useHideOnTransition(
        () => theory.current,
        () => setDisplay("none"),
        () => setDisplay("flex"));

    return (
        <section
            id="theory"
            style={{
                display: display,
                opacity: visible ? "" : 0,
                pointerEvents: visible ? "auto" : "none"
            }}
            ref={theory}
        >
            <h1>Сварка оптических волокон и монтаж ВОЛП</h1>
            <section id="focl-installation">
                <h3>1 Монтаж ВОЛП</h3>
                <p>
                    Любая ВОЛП состоит из оптических кабелей, муфт и оптических оконечных устройств.
                    Оптические кабели производятся строительными длинами. Соединение строительных длин оптического кабеля включает в себя
                    сращивание оптических волокон, восстановление бронепокровов и наружной оболочки. Для выполнения этих операций используются
                    соединительные муфты, позволяющие соединить, как минимум, две строительные длины оптического кабеля.
                    Муфты применяются на магистральных, зоновых и местных сетях связи, для всех условий прокладки и эксплуатации оптических
                    кабелей связи: на подземных, подвесных, подводных кабельных линиях, а также в кабелях, прокладываемых в трубах
                    кабельной канализации или коллекторах.
                </p>
                <p>
                    Для соединения и распределения устройств оптических волокон линейных оптических кабелей с помощью оптических пигтейлов и соединительных
                    оптических кабелей (патчкордов) применяются оконечные устройства ВОЛП.
                </p>
                <p>
                    Соединение оптических волокон является одной из наиболее ответственных операций при монтаже кабеля, во многом определяющей качество
                    и дальность связи ВОЛП. Возможны два вида соединений оптических волокон: разъемные и неразъемные.
                </p>
                <p>
                    Разъемные соединители оптических волокон, в общем случае, представляют собой арматуру, предназначенную для юстировки и фиксации
                    соединяемых волокон, а также для механической защиты сростка. Основными требованиями к ним являются простота конструкции, малые потери,
                    устойчивость к механическим и климатическим воздействиям, надежность, а также неизменность параметров при повторной стыковке.
                </p>
                <p>
                    Неразъемные соединения могут быть выполнены путем сварки оптических волокон или с помощью механических сростков. Соединения полученные,
                    путем сварки обладают наименьшими потерями и отражениями, а также большей надежностью, чем остальные виды соединений. В связи с этим, на
                    протяженных участках для сращивания оптических волокон преимущественно применяются именно сварные соединения.
                </p>
            </section>
            <section id="permanent-connection-requirements">
                <h3>2 Требования к неразъемным соединениям ОВ</h3>
                <p>
                    Сращивание оптических волокон должно удовлетворять требованиям эксплуатации ВОЛП. Необходимо, чтобы надёжность стыков оптических волокон
                    была не ниже, чем самих оптических волокон. Соответственно, соединение оптических волокон должно обладать достаточной механической
                    прочностью, возможность возникновения дефектов в волокнах при подготовке концов оптических волокон к соединению и при их сращивании
                    должна быть сведена к минимуму.
                </p>
                <p>
                    Качество соединения оптических волокон в первую очередь характеризуется затуханием в месте соединения и прочностью соединения.
                    Потери, вносимые соединением оптических волокон делятся на внутренние и внешние.
                </p>
                <p>
                    Внутренние потери — это потери, связанные со свойствами самого волокна, такими как, например, вариациями диаметра сердцевины,
                    числовой апертуры, профиля показателя преломления, некруглостью и неконцентричностью сердцевины и оболочки.
                    Внутренние потери являются результатом соединения двух неодинаковых волокон.
                </p>
                <p>
                    Внешние потери — это потери, связанные со смещением волокон и качеством торцов соединяемых волокон, а также деформацией
                    сердцевины при сварке, её загрязнением, образованием пузырька газа, а также с возникновением различных дефектов на стыке
                    оптических волокон. Примеры таких дефектов приведены на рисунке 1.
                </p>
                <p>
                    В реальности необходимо учитывать воздействие суммарных потерь в соединениях оптических волокон.
                </p>

                <Figure src={Figure1}>
                    Рисунок 1 — Дефекты на стыке оптических волокон: 1 — зазор; 2 — осевое смещение; 3 — угловое смещение; 4 — непараллельность торцов;
                    5 — шероховатость торцов; 6 — различие диаметров сердцевин; 7 — различие числовых апертур; 8 — некруглость;
                    9 — изменение диаметра сердцевины в процессе сварки; 10 — образование газового пузырька, загрязнение; 11 — образование микроизгиба
                </Figure>
            </section>
            <section id="splice-preparations">
                <h3>3 Подготовка ОВ к сращиванию</h3>
                <p>
                    Процесс подготовки оптического волокна к сращиванию включает в себя операции снятия первичного покрытия волокна и скалывания
                    для получения хорошо обработанной торцевой поверхности волокна. В основном используются оптические волокна с акриловым покрытием.
                </p>
                <p>
                    Для снятия защитного покрытия существуют три способа: механический, химический и термический. Наиболее распространенным способом,
                    особенно в полевых условиях является механический способ, который подразумевает использование специального инструмента,
                    который получил название стриппер. Принцип его применения показан на рисунке 2.
                </p>

                <Figure src={Figure2}>
                    Рисунок 2 — Последовательность операций по снятию защитного покрытия с оптического волокна при помощи стриппера
                    а — вставка ОВ в раскрытый стриппер; б — закрытие стриппера; в — протягивание ОВ через стриппер
                </Figure>

                <p>
                    Перед снятием защитного покрытия стриппер и оптическое волокно обязательно протираются спиртом, никакая другая жидкость
                    применяться не должна. Стрипперы настраиваются и регулируются на заводе-изготовителе и не требуют испытаний и проверок.
                </p>
                <p>
                    Для химической зачистки применяются растворители красок, содержащие в качестве активного вещества метилен хлорид.
                    После замачивания концов волокон в ёмкости с растворителем в течение минуты происходит размягчение первичного защитного покрытия,
                    которое при незначительных усилиях снимается с волокна. Очищенное волокно вытирается мягкой тканью, смоченной спиртом или ацетоном.
                    При заводском способе зачистки в качестве активного вещества применяют горячую серную кислоту.
                </p>
                <p>
                    Чистота поверхности оптических волокон перед сваркой имеет очень важное значение. Посторонние примеси, частицы на поверхности
                    свариваемого ОВ могут стать центром развития процесса расстекловывания, что значительно снизит прочность места сварки.
                    Плохая очистка (остатки материала защитного покрытия или другие посторонние частицы) служат причиной образования пузырей воздуха
                    в месте сварки. Поэтому зачищенные концы оптических волокон тщательно протирают чистым материалом, смоченным спиртом. На поверхности
                    оптического волокна также нельзя допускать наличие трещин, которые могут возникать при снятии покрытия, так как они уменьшают прочность места сварки.
                </p>
                <p>
                    Волокна должны разрезаться аккуратно и перпендикулярно оси волокна; поверхности торцов не должны иметь никаких зазубрин или сколов.
                    Для получения аккуратного среза волокно должно быть вначале надсечено перпендикулярно своей оси, чтобы получить локализованную трещину.
                    В результате получается перпендикулярный разлом, если напряжение прикладывается перпендикулярно оси.
                </p>
                <p>
                    Для получения хорошо обработанной торцевой поверхности оптического волокна проводят операцию скалывания при помощи прецизионных скалывателей.
                    Операция скалывания заключается в следующем: на поверхность оптического волокна с удаленным первичным покрытием наносят насечку с последующим
                    приложением к ней растягивающей, изгибающей или комбинации этих нагрузок, вызывающих рост трещины и скол оптического волокна в данном месте.
                    На практике применяются механические и электронные устройства для скола оптических волокон.
                </p>
                <p>
                    Образование ровного и перпендикулярного относительно оси скола обеспечивается за счёт нанесения резцом на поверхности предварительно напряжённого,
                    растянутого и изогнутого оптического волокна, надреза. Резец с определенным углом заточки выполнен в виде стальной пластинки с алмазным
                    напылением или из специального твёрдого сплава.
                </p>
                <p>
                    Скол, выполненный полностью вручную при помощи механического скалывателя, для получения  высокого качества скола требует достаточно
                    высокой квалификации специалиста.
                </p>
                <p>
                    Известны также ручные полуавтоматические инструменты для скола ОВ. В них обеспечивается фиксация волокна с удаленным покрытием.
                    При нажатии рычага (кнопки) управления инструмента, одновременно с натяжением волокна, резцом наносится надрез (насечка) на его поверхности.
                    Растягивающие усилия, прикладываемые к ОВ, и сила удара резца относительно ОВ после нанесения насечки, увеличивает рабочий участок режущей
                    поверхности и срок службы инструмента. Инструмент позволяет стабильно получать хорошие сколы ОВ и не предъявляет жёстких требований к квалификации персонала.
                </p>
                <p>
                    Примером скалывателя полуавтоматического типа является CT20 японской компании Fujikura, получивший широкое практическое применение,
                    его внешний вид показан на рисунке 3.
                </p>

                <Figure src={Figure3}>
                    Рисунок 3 — Скалыватель оптических волокон Fujikura CT20
                </Figure>

                <p>
                    Стабильно высокое качество сколов ОВ можно получить при использовании автоматических устройств – электронных скалывателей.
                    Волокно с удаленным покрытием фиксируется в инструменте. Под действием электронно-управляемого двигателя резец вибрирует с
                    низкой частотой и нарастающей амплитудой, приближаясь к волокну, которое натягивается синхронно с частотой вибрации резца.
                    При нанесении резцом насечки на поверхности волокна под действием растягивающих усилий ОВ обламывается.
                </p>
                <p>
                    На рисунке 4 показан общий вид электронного устройства для скола ОВ Fujikura CT50. Это устройство позволяет осуществлять скалывание с помощью специального
                    лезвия из высокопрочной стали. Поддерживается автоматический поворот ножа по мере его износа.
                    Устройство может также может использовать Bluetooth для связи со сварочным аппаратом.
                </p>

                <Figure src={Figure4}>
                    Рисунок 4 — Внешний вид автоматического скалывателя Fujikura CT50
                </Figure>
            </section>
            <section id="fiber-alignment">
                <h3>4 Юстировка</h3>
                <p>
                    Юстировка — это процесс центрирования осей сращиваемых оптических волокон. Данный процесс во многом определяет качество сварного соединения.
                </p>
                <p>Различают следующие способы юстировки оптических волокон:</p>
                <p>1) с помощью V-образных канавок;</p>
                <p>2) юстировка двух эксцентрических сердцевин;</p>
                <p>3) система PAS (Profile Alignment System) – система совмещения по геометрическим параметрам;</p>
                <p>4) система LID (Local Light Injection and Detection System) – система локального ввода и детектирования света;</p>
                <p>5) юстировка по нагретым сердцевинам (CDS – Core Detection System, система детектирования сердцевины).</p>
                <p>В современных сварочных аппаратах для произведения юстировки преимущественно применяются способы PAS и LID.</p>
                <h4>4.1 Юстировка с помощью V-образных канавок.</h4>
                <p>
                    Данный способ юстировки является самым простым и дешевым. Он не позволяет определить положение сердцевины в оптическом волокне, волокна сводятся
                    только по внешней оболочке посредством V-образных канавок. Главным недостатком данного способа юстировки является относительно низкое качество сварки.
                    В первую очередь это обусловлено отсутствием возможности сварочного аппарата устранять потери, вызванные смещением сердцевины оптического волокна.
                    Также, загрязнение V-образных канавок приводит к смещению осей оптических волокон относительно друг друга. Принцип работы юстировки с помощью
                    V-образных канавок показан на рисунке 5.
                </p>

                <Figure src={Figure5} width="300">
                    Рисунок 5 — Юстировка с помощью V-образных канавок
                </Figure>

                <h4>4.2 Юстировка двух эксцентрических сердцевин.</h4>
                <p>
                    Торцы двух волокон соединяются в двух одинаковых гильзах, которые затем вставляются в юстировочную трубку. Оси этих гильз смещены относительно
                    друг друга, в результате чего юстировка достигается путем вращения гильз.
                    Для непрерывного контроля юстировки применяется детектирование света. Данный метод юстировки применяется в сочетании с другими методами юстировки.
                </p>

                <h4>4.3 Юстировка методом PAS.</h4>
                <p>
                    При таком способе юстировки, торцы ОВ освещаются сбоку параллельным пучком света так, что из-за разницы показателей преломления оболочка и сердцевина
                    фокусируют свет, действуя как цилиндрические линзы. Принцип работы метода PAS показан на рисунке 6.
                </p>

                <Figure src={Figure6} width="300">
                    Рисунок 6 — Юстировка оптических волокон способом PAS
                </Figure>

                <p>
                    При этом формируется изображение, на котором видны границы сердцевины и оболочки волокна, что позволяет определить эксцентриситет в каждом из волокон.
                    Анализ изображения, выполняемый с помощью телекамеры и встроенного контроллера сварочного аппарата, позволяет осуществить юстировку световодов.
                    Одновременно контроллер системы управления аппарата оценивает качество скола торцевой поверхности волокон и в случае выявления каких-либо дефектов
                    прекращает процесс сварки. Система используется и для грубой юстировки, и для тонкой подстройки волокон.
                </p>
                <h4>4.4 Юстировка методом LID.</h4>
                <p>
                    Этот способ юстировки ограничен исключительно местом соединения. Тестовый оптический сигнал с выхода источника излучения вводится через изгиб в
                    сердцевину ОВ слева, проходит зону стыка, поступает в ОВ справа и выводится также через изгиб на фотоприемник, где и регистрируется его мощность.
                    Сварочный аппарат сводит оптические волокна таким образом, чтобы на выводе получить сигнал наибольшей мощности. Юстировка может продолжаться даже
                    в процессе сварки, что позволяет добиться минимальных потерь на соединении. Принцип работы данного метода показан на рисунке 7.
                </p>
                <p>
                    Способ LID является наиболее эффективным, поскольку, в отличие от способа PAS, качество соединения в большей мере зависит от сварочного аппарата,
                    а не от индивидуального мастерства персонала.
                </p>

                <Figure src={Figure7} width="400">
                    Рисунок 7 — Юстировка оптических волокон методом LID
                </Figure>

                <h4>4.5 Юстировка по нагретым сердцевинам.</h4>
                <p>
                    Данный метод юстировки волокна основан на разности люминесцентных характеристик сердцевины и оболочки оптического волокна. Оптические волокна разогреваются сварочным
                    аппаратом при помощи дугового разряда до состояния, когда они начинают светиться. Состав примесей сердцевины и оболочки оптического волокна различается, поэтому сердцевина
                    волокна светиться ярче, чем оболочка. Микроконтроллер сварочного аппарата определяет геометрию сердцевины и оболочки по обнаруженной разности контраста.
                    После определения геометрии оптических волокон сварочный аппарат сводит волокна по трем осям. Юстировка по нагретым сердцевинам характеризуется высокой скоростью.
                    Данный метод может быть совмещен с методом LID. Основным недостатком юстировки методом нагретых сердцевин является высокая стоимость соответствующих сварочных аппаратов.
                </p>
            </section>
            <section id="splicing">
                <h3>5 Сварка оптических волокон</h3>
                <p>
                    Соединение оптических волокон с помощью сварки на сегодняшний день является наиболее распространенным методом получения неразъемных соединений.
                    Благодаря совершенной технологии этот метод позволяет получать качественные соединения с низкими показателями вносимых потерь (порядка 0,05-0,1 дБ и меньше),
                    что обуславливает его применение на ВОЛП, где этот показатель входит в приоритетные.
                </p>
                <p>
                    В процессе сварки оптических волокон концы волокон оплавляются путем помещения их в поле мощного источника тепловой энергии, например поле электрического
                    разряда или зоны мощного лазерного излучения.
                </p>
                <p>
                    Основным достоинством сварки в поле электрического разряда является быстрота и технологичность. Этот метод в настоящее время приобрёл
                    наибольшую популярность для сварки оптических волокон.
                </p>
                <p>Аппараты для сварки оптических волокон можно классифицировать следующим образом:</p>
                <p>1) по способу юстировки свариваемых концов оптических волокон;</p>
                <p>2) по способу проведения операций (ручные или автоматические);</p>
                <p>3) по типу устройства контроля (микроскоп, монитор на жидких кристаллах);</p>
                <p>4) по количеству оптических волокон.</p>
                <p>Внешний вид сварочного аппарата приведен на рисунке 8.</p>
                <p>
                    Сварка оптических волокон осуществляется посредством чередования коротких импульсов тока высокой интенсивности с импульсами тока низкой
                    интенсивности (релаксационными импульсами). При этом после сваривания в электрическом поле импульса высокой интенсивности в поле релаксационного импульса
                    происходит перемещение оптических волокон под действием поверхностного натяжения. Количество чередующихся импульсов зависит от смещения сердцевин оптических
                    волокон, которое постоянно контролируется сварочным аппаратом.
                </p>

                <Figure src={Figure8}>
                    Рисунок 8 — Внешний вид сварочного аппарата Fujikura FSM-30S
                </Figure>

                <p>
                    Перед сваркой оптический волокон производится предварительное оплавление  их концов с помощью дуги. В процессе плавления для предотвращения укорачивания одного
                    из волокон они подаются одновременно. Эти операции выполняются автоматически сварочным аппаратом. В некоторых случаях может возникнуть необходимость разработать
                    специальный цикл плавления (время и величину тока для плавления) для различных типов соединяемых волокон.
                </p>
                <p>
                    Для снятия механического напряжения в точке соединения волокон в сварочных аппаратах предусмотрено прогревание места стыка волокон после окончания сварки.
                    Данный режим известен как «режим релаксации».
                </p>
                <p>
                    Некоторые сварочные аппараты также могут выполнять тест на растяжение волокна. Данный тест позволяет проверить прочность сростка и избежать нарушения
                    соединения при выкладке сростков в кассету и в процессе эксплуатации. Для этого сваренное оптическое волокно прочно закрепляется в направляющих платформах,
                    которые под контролем микропроцессора расходятся в противоположные стороны, создавая растяжение в месте стыка. Стык, прошедший тест на растяжение,
                    обладает большей надежностью и качеством.
                </p>
                <p>
                    Потери на сварных соединениях зависят от нескольких факторов: опыта персонала, геометрических погрешностей свариваемых оптических волокон, а также от материалов,
                    из которых изготовлены волокна. Особенно часто проблемы возникают при сварке оптических волокон различных производителей, так как изготавливаются с использованием
                    принципиально отличающихся друг от друга технологических процессов.
                </p>
                <p>
                    Для сварки наибольшее влияние имеют следующие характеристики: плотность, коэффициент теплового расширения, показатель преломления, вязкость и механические характеристики.
                    Эти параметры определяют оптические потери в местах сращивания и должны приниматься во внимание при использовании оптических волокон, произведённых по различным технологиям.
                </p>
                <p>
                    Более совершенные аппараты для сварки оптических волокон содержат программы, оптимизирующие процесс сварки для оптических волокон различных типов и различных производителей,
                    однако возможны ситуации, когда, используя стандартные программы, невозможно получить качественную сварку. В этих случаях необходимо самостоятельно корректировать параметры
                    процесса (время и ток, подаваемый на электроды) для достижения оптимальных результатов.
                </p>
                <p>
                    При соединении оптических волокон с помощью плавления нарушение юстировки сердцевин волокон вследствие совместного влияния натяжения поверхности, которое имеет место в точке плавления,
                    и неконцентричности сердцевины волокна можно минимизировать следующими способами:
                </p>
                <p>
                    1) сокращением времени плавления оптических волокон или же уменьшения длины свободного конца оптического волокна в сварочном устройстве, позволяя  концам волокна в процессе сварки
                    сдвигаться на очень малое расстояние;
                </p>
                <p>
                    2) использованием компенсационных программ, таких как управление смещением сердцевины с помощью метода умышленного смещения осей (IAS).
                </p>
                <p>Требования, которые необходимо принимать во внимание при анализе сварочных технологий, можно разбить на следующие группы:</p>
                <p>- оптические параметры сварного соединения — потери в сварном соединении, отражения в сварном соединении;</p>
                <p>- производительность сварочного аппарата — время сварки, оценка потерь;</p>
                <p>- удобство работы оператора — габариты и масса, электропитание, степень автоматизации работы;</p>
                <p>- функциональные возможности — типы свариваемых волокон, внесение заданных потерь в сварном соединении;</p>
                <p>- надежность работы аппарата — защита и адаптация к внешним условиям, тестирование сварного соединения.</p>
                <p>
                    В конечном счёте от сварочного аппарата требуется обеспечить высокое качество сварки и механическую прочность соединения при минимальной стоимости операции сварки.
                    Последнего можно добиться повышением производительности работы оператора и увеличением функциональных возможностей. Это достигается, когда относительно недорогой
                    аппарат можно использовать не только для сварки, но и для всех видов работ (строительство, монтаж, ремонт и изготовление аттенюаторов) и для всех типов свариваемых
                    волокон: многомодовых (MM) и одномодовых (SM), со смещённой дисперсией (DS) и со смещённой ненулевой дисперсией (NZDS), со сдвигом отсечки (CS) и легированных эрбием.
                </p>
                <p>
                    После сварки оптических волокон место стыка необходимо защитить. Для этого используются специальные гильзы: ГЗС (гильзы для защиты сростков) или КДЗС (комплект деталей для защиты сростков).
                    Конструкция ГЗС представлена на рисунке 9. ГЗС содержит термоусаживаемую трубку, внутри которой  находится несущий металлический стержень
                    диаметром 1 мм и трубку из материала высокой текучести — сэвилена.
                </p>

                <Figure src={Figure9}>
                    Рисунок 9 — Конструкция гильзы для защиты сростка ОВ: 1 — трубка из сэвилена; 2 — термоусаживаемая трубка; 3 — металлический стержень; 4 — оптическое волокно
                </Figure>

                <p>
                    Перед сваркой волокон гильзу надевают на один из сращиваемых концов оптического волокна. Затем после сварки её надвигают на место сварки и нагревают. В процессе нагрева и усаживания трубки
                    сэвилен расплавляется и уплотняется вокруг оптического волокна. Несущий металлический элемент надёжно защищает оптическое волокно от изгиба внутри термоусаживаемой трубки.
                </p>
            </section>
            <section style={{maxWidth: "800px", width: "100%"}}>
                <h3>Руководство по эксплуатации Fujikura FSM-30S</h3>
                <a target="_blank" href="./assets/FUJIKURA_FSM-30S_user_guide.pdf">
                    Руководство по эксплуатации Fujikura FSM-30S
                </a>
            </section>
            <div style={{margin: "8px"}}></div>
            <button
                className="blue-button blue-button-centered"
                id="finish-theory-button"
                onClick={goNext}
            >
                Продолжить
            </button>
        </section>
    );
}

function Figure({src, children, ...props}) {
    return (
        <figure>
            <img src={src} {...props} />
            <figcaption>
                {children}
            </figcaption>
        </figure>
    );
}
