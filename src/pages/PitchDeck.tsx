
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, MapPin, Users, Heart, TrendingUp, Target, DollarSign, Calendar, Smartphone, Star, Coffee, Utensils, Music } from "lucide-react";

const PitchDeck = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      type: "title",
      title: "CheckIn",
      subtitle: "Conecte-se aos melhores lugares",
      description: "A plataforma que revoluciona como pessoas descobrem e se conectam em locais físicos",
      gradient: "from-checkin-turquoise-500 to-checkin-petrol-600"
    },
    {
      id: 2,
      type: "problem",
      title: "O Problema",
      points: [
        "Pessoas não sabem onde ir ou o que fazer",
        "Estabelecimentos lutam para atrair clientes",
        "Falta de conexão social em espaços físicos",
        "Informações desatualizadas sobre movimento e ambiente"
      ],
      icon: Target,
      stats: "68% das pessoas usam apps para decidir onde ir"
    },
    {
      id: 3,
      type: "solution",
      title: "Nossa Solução",
      description: "CheckIn combina descoberta de lugares, networking social e experiências personalizadas em tempo real",
      features: [
        { icon: MapPin, title: "Descoberta Inteligente", desc: "Encontre lugares baseado em suas preferências" },
        { icon: Users, title: "Networking Local", desc: "Conecte-se com pessoas nos mesmos locais" },
        { icon: Star, title: "Reviews em Tempo Real", desc: "Avaliações e movimento atual dos estabelecimentos" },
        { icon: Heart, title: "Experiências Personalizadas", desc: "Sugestões baseadas no seu histórico e gostos" }
      ]
    },
    {
      id: 4,
      type: "market",
      title: "Mercado",
      stats: [
        { value: "R$ 2.8B", label: "Mercado de food & beverage no Brasil", color: "bg-checkin-turquoise-500" },
        { value: "87%", label: "Brasileiros que usam apps para lazer", color: "bg-checkin-petrol-500" },
        { value: "43M", label: "Usuários ativos em apps de descoberta local", color: "bg-checkin-turquoise-600" },
        { value: "156%", label: "Crescimento do social commerce", color: "bg-checkin-petrol-600" }
      ]
    },
    {
      id: 5,
      type: "business",
      title: "Modelo de Negócio",
      revenue: [
        { source: "Freemium", percentage: "40%", desc: "Recursos premium para usuários" },
        { source: "Estabelecimentos", percentage: "35%", desc: "Assinatura para donos de locais" },
        { source: "Publicidade", percentage: "20%", desc: "Promoções e destaque de locais" },
        { source: "Comissões", percentage: "5%", desc: "Parcerias com delivery e eventos" }
      ]
    },
    {
      id: 6,
      type: "traction",
      title: "Tração",
      metrics: [
        { metric: "1.2K+", label: "Usuários registrados", icon: Users },
        { metric: "180+", label: "Estabelecimentos parceiros", icon: MapPin },
        { metric: "4.8★", label: "Avaliação na app store", icon: Star },
        { metric: "15%", label: "Crescimento mensal", icon: TrendingUp }
      ],
      testimonial: {
        text: "O CheckIn mudou completamente como descobrimos lugares novos. É como ter um amigo local que sempre sabe onde está rolando algo legal!",
        author: "Marina S., usuária beta"
      }
    },
    {
      id: 7,
      type: "roadmap",
      title: "Roadmap",
      quarters: [
        {
          period: "Q1 2024",
          goals: ["Lançamento oficial", "1K usuários ativos", "100 estabelecimentos"]
        },
        {
          period: "Q2 2024", 
          goals: ["Recursos premium", "5K usuários", "IA para recomendações"]
        },
        {
          period: "Q3 2024",
          goals: ["Expansão para SP", "10K usuários", "Parcerias estratégicas"]
        },
        {
          period: "Q4 2024",
          goals: ["Monetização completa", "25K usuários", "Expansão nacional"]
        }
      ]
    },
    {
      id: 8,
      type: "team",
      title: "Time",
      description: "Equipe experiente em tecnologia, produto e mercado local",
      roles: [
        "CEO/CTO - 8 anos em tech startups",
        "Head de Produto - Ex-iFood, especialista em UX",
        "Head de Growth - Ex-Uber, foco em aquisição",
        "Desenvolvedor Senior - Full-stack, 6 anos experiência"
      ]
    },
    {
      id: 9,
      type: "investment",
      title: "Investimento",
      ask: "R$ 500K",
      use: [
        { category: "Desenvolvimento", percentage: "40%", amount: "R$ 200K" },
        { category: "Marketing & Growth", percentage: "30%", amount: "R$ 150K" },
        { category: "Equipe", percentage: "20%", amount: "R$ 100K" },
        { category: "Operações", percentage: "10%", amount: "R$ 50K" }
      ],
      timeline: "12 meses para atingir 25K usuários ativos"
    },
    {
      id: 10,
      type: "closing",
      title: "Vamos Conectar o Mundo Real",
      subtitle: "CheckIn é o futuro da descoberta e conexão local",
      cta: "Junte-se a nós nessa jornada",
      contact: "contato@checkin.app"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const renderSlide = (slide) => {
    switch (slide.type) {
      case "title":
        return (
          <div className={`h-full flex flex-col justify-center items-center text-center p-8 bg-gradient-to-br ${slide.gradient} text-white relative overflow-hidden`}>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
              <div className="absolute bottom-20 right-16 w-16 h-16 bg-white rounded-full animate-pulse delay-300"></div>
              <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white rounded-full animate-pulse delay-700"></div>
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 mx-auto">
                <MapPin className="w-8 h-8 text-checkin-turquoise-600" />
              </div>
              <h1 className="text-4xl font-bold mb-4">{slide.title}</h1>
              <p className="text-xl mb-6 opacity-90">{slide.subtitle}</p>
              <p className="text-lg opacity-80 max-w-2xl">{slide.description}</p>
            </div>
          </div>
        );

      case "problem":
        return (
          <div className="h-full p-8 flex flex-col">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                <slide.icon className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">{slide.title}</h2>
            </div>
            
            <div className="grid gap-4 mb-8 flex-1">
              {slide.points.map((point, index) => (
                <Card key={index} className="p-4 border-l-4 border-red-500 hover-scale">
                  <p className="text-gray-700">{point}</p>
                </Card>
              ))}
            </div>

            <Card className="p-6 bg-red-50 border-red-200">
              <div className="flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-red-600 mr-3" />
                <p className="text-lg font-semibold text-red-800">{slide.stats}</p>
              </div>
            </Card>
          </div>
        );

      case "solution":
        return (
          <div className="h-full p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">{slide.title}</h2>
            <p className="text-lg text-gray-600 mb-8">{slide.description}</p>
            
            <div className="grid grid-cols-2 gap-6">
              {slide.features.map((feature, index) => (
                <Card key={index} className="p-6 hover-scale border-checkin-turquoise-200 hover:border-checkin-turquoise-400 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-checkin-turquoise-500 to-checkin-petrol-600 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.desc}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case "market":
        return (
          <div className="h-full p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">{slide.title}</h2>
            
            <div className="grid grid-cols-2 gap-6">
              {slide.stats.map((stat, index) => (
                <Card key={index} className="p-6 text-center hover-scale">
                  <div className={`w-16 h-16 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-2xl font-bold text-white">{stat.value}</span>
                  </div>
                  <p className="text-gray-700 font-medium">{stat.label}</p>
                </Card>
              ))}
            </div>

            <Card className="mt-8 p-6 bg-gradient-to-r from-checkin-turquoise-50 to-checkin-petrol-50 border-checkin-turquoise-200">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-checkin-petrol-700 mb-2">
                  Oportunidade de Mercado Total
                </h3>
                <p className="text-3xl font-bold text-checkin-turquoise-600">R$ 2.8 Bilhões</p>
                <p className="text-sm text-checkin-petrol-600 mt-2">
                  Crescimento anual projetado de 15% nos próximos 5 anos
                </p>
              </div>
            </Card>
          </div>
        );

      case "business":
        return (
          <div className="h-full p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">{slide.title}</h2>
            
            <div className="grid gap-4">
              {slide.revenue.map((revenue, index) => (
                <Card key={index} className="p-4 hover-scale">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-checkin-turquoise-500 to-checkin-petrol-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">{revenue.percentage}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{revenue.source}</h3>
                        <p className="text-sm text-gray-600">{revenue.desc}</p>
                      </div>
                    </div>
                    <Badge className="bg-checkin-turquoise-100 text-checkin-turquoise-800">
                      {revenue.percentage}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-center justify-center space-x-4">
                <DollarSign className="w-8 h-8 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold text-green-800">Projeção de Receita</h3>
                  <p className="text-sm text-green-600">R$ 2M ARR até final de 2024</p>
                </div>
              </div>
            </Card>
          </div>
        );

      case "traction":
        return (
          <div className="h-full p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">{slide.title}</h2>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              {slide.metrics.map((metric, index) => (
                <Card key={index} className="p-6 text-center hover-scale">
                  <div className="w-12 h-12 bg-gradient-to-br from-checkin-turquoise-500 to-checkin-petrol-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <metric.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800 mb-2">{metric.metric}</p>
                  <p className="text-sm text-gray-600">{metric.label}</p>
                </Card>
              ))}
            </div>

            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  "
                </div>
                <div>
                  <p className="text-gray-700 italic mb-2">{slide.testimonial.text}</p>
                  <p className="text-sm font-semibold text-blue-600">— {slide.testimonial.author}</p>
                </div>
              </div>
            </Card>
          </div>
        );

      case "roadmap":
        return (
          <div className="h-full p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">{slide.title}</h2>
            
            <div className="grid grid-cols-2 gap-6">
              {slide.quarters.map((quarter, index) => (
                <Card key={index} className="p-6 hover-scale">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-checkin-turquoise-500 to-checkin-petrol-600 rounded-lg flex items-center justify-center mr-4">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">{quarter.period}</h3>
                  </div>
                  <ul className="space-y-2">
                    {quarter.goals.map((goal, goalIndex) => (
                      <li key={goalIndex} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-checkin-turquoise-500 rounded-full mr-3"></div>
                        {goal}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        );

      case "team":
        return (
          <div className="h-full p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">{slide.title}</h2>
            <p className="text-lg text-gray-600 mb-8">{slide.description}</p>
            
            <div className="grid gap-4">
              {slide.roles.map((role, index) => (
                <Card key={index} className="p-4 hover-scale">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-checkin-turquoise-500 to-checkin-petrol-600 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-gray-700">{role}</p>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">
                  Experiência Combinada
                </h3>
                <p className="text-3xl font-bold text-purple-600">25+ Anos</p>
                <p className="text-sm text-purple-600 mt-2">
                  Em startups, tecnologia e mercado brasileiro
                </p>
              </div>
            </Card>
          </div>
        );

      case "investment":
        return (
          <div className="h-full p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">{slide.title}</h2>
            
            <div className="text-center mb-8">
              <p className="text-4xl font-bold text-checkin-turquoise-600 mb-2">{slide.ask}</p>
              <p className="text-gray-600">{slide.timeline}</p>
            </div>

            <div className="grid gap-4 mb-8">
              {slide.use.map((use, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-checkin-turquoise-500 to-checkin-petrol-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{use.percentage}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{use.category}</h3>
                        <p className="text-lg font-bold text-checkin-turquoise-600">{use.amount}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case "closing":
        return (
          <div className="h-full flex flex-col justify-center items-center text-center p-8 bg-gradient-to-br from-checkin-turquoise-500 to-checkin-petrol-600 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 right-10 w-24 h-24 bg-white rounded-full animate-pulse"></div>
              <div className="absolute bottom-16 left-12 w-20 h-20 bg-white rounded-full animate-pulse delay-500"></div>
              <div className="absolute top-1/3 left-1/3 w-16 h-16 bg-white rounded-full animate-pulse delay-1000"></div>
            </div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-8 mx-auto">
                <MapPin className="w-10 h-10 text-checkin-turquoise-600" />
              </div>
              <h1 className="text-4xl font-bold mb-4">{slide.title}</h1>
              <p className="text-xl mb-8 opacity-90">{slide.subtitle}</p>
              <p className="text-lg mb-8 opacity-80">{slide.cta}</p>
              <Badge className="bg-white text-checkin-turquoise-600 text-lg px-6 py-2">
                {slide.contact}
              </Badge>
            </div>
          </div>
        );

      default:
        return <div>Slide não encontrado</div>;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-checkin-turquoise-500 to-checkin-petrol-600 rounded-full flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-bold gradient-text">CheckIn Pitch Deck</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {currentSlide + 1} / {slides.length}
          </span>
        </div>
      </div>

      {/* Slide Content */}
      <div className="flex-1 bg-white m-4 rounded-lg shadow-lg overflow-hidden">
        {renderSlide(slides[currentSlide])}
      </div>

      {/* Navigation */}
      <div className="bg-white p-4 flex items-center justify-between">
        <Button 
          onClick={prevSlide} 
          variant="outline"
          disabled={currentSlide === 0}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Anterior</span>
        </Button>

        {/* Slide Indicators */}
        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide 
                  ? 'bg-checkin-turquoise-500' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        <Button 
          onClick={nextSlide}
          variant="outline" 
          disabled={currentSlide === slides.length - 1}
          className="flex items-center space-x-2"
        >
          <span>Próximo</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default PitchDeck;
