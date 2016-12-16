port module ElmDemoWidget exposing (main)

import Html exposing (Html, text, strong)

type alias Features =
   { htmlText: String
   }

type alias Model =
   { features: Features
   }

type Msg =
   FeaturesReceived Features

port axFeatures : (Features -> msg) -> Sub msg

init : ( Model, Cmd Msg )
init =
   ( { features = { htmlText = "" } }
   , Cmd.none )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
   case msg of
      FeaturesReceived features ->
         ( { model | features = features }
         , Cmd.none )

subscriptions : Model -> Sub Msg
subscriptions model =
   axFeatures FeaturesReceived

view : Model -> Html Msg
view model =
   strong [] [text model.features.htmlText]

main : Program Never Model Msg
main =
   Html.program
      { init = init
      , view = view
      , update = update
      , subscriptions = subscriptions }
