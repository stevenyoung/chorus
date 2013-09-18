require 'spec_helper'
require 'will_paginate/array'

describe MilestonesController do
  let(:user) { users(:owner) }
  let(:workspace) { workspaces(:public) }

  before do
    log_in user
  end

  describe "#index" do
    it "responds with milestones" do
      get :index, :workspace_id => workspace.id
      response.code.should == "200"
      decoded_response.length.should be > 1
      decoded_response.length.should == workspace.milestones.count
    end

    it "sorts by target date by default" do
      get :index, :workspace_id => workspace.id
      target_dates = decoded_response.map { |milestone| milestone.target_date }
      target_dates.should == target_dates.sort
    end

    generate_fixture "milestoneSet.json" do
      get :index, :workspace_id => workspace.id
    end
  end

  describe '#create' do
    let(:params) {
      {
        :workspace_id => workspace.id,
        :milestone => {
          :name => 'cool milestone',
          :target_date => '2020-07-30T14:00:00-07:00'
        }
      }
    }

    it 'creates a new milestone from the params' do
      expect {
        post :create, params
      }.to change(Milestone, :count).by(1)

      Milestone.last.name.should == 'cool milestone'
    end

    it 'renders the created job as JSON' do
      post :create, params
      response.code.should == '201'
      decoded_response.should_not be_empty
    end
  end
end